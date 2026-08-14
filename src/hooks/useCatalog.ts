import { useState, useEffect, useMemo } from 'react';
import { CatalogData, Category, Product, Subcategory, Model, Order, Customer, OrderStatus, User } from '../types';
import { useTerminal } from './useTerminal';
import { sendVerificationCode, generateCode } from '../services/emailService';

import categoriesData from '../data/categories.json';
import usersData from '../data/users.json';
import ordersData from '../data/orders.json';
import customersData from '../data/customers.json';

import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import localforage from 'localforage';

const STORAGE_KEY = "catalogo_pro_local_v3"; // Bumped version to force reset for user data as requested

const starterData: CatalogData = {
  categories: categoriesData as Category[],
  users: usersData as User[],
  orders: ordersData as Order[],
  customers: customersData as Customer[]
};


export function useCatalog() {
  const { addLog } = useTerminal();

  const [data, _setData] = useState<CatalogData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : starterData;
    
    // Migration: ensure subcategories have models and models have submodels
    if (parsed.categories && Array.isArray(parsed.categories)) {
      parsed.categories.forEach((cat: Category) => {
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
          cat.subcategories.forEach((sub: any) => {
            if (!sub.models) {
              sub.models = [];
              if (sub.products && Array.isArray(sub.products) && sub.products.length > 0) {
                sub.models.push({
                  id: 'mod-legacy-' + sub.id,
                  name: 'GENERAL',
                  submodels: [{
                    id: 'submod-legacy-' + sub.id,
                    name: 'GENERAL',
                    products: sub.products
                  }]
                });
                delete sub.products;
              }
            } else {
              sub.models.forEach((mod: any) => {
                if (!mod.submodels) {
                  mod.submodels = [];
                  if (mod.products && Array.isArray(mod.products) && mod.products.length > 0) {
                    mod.submodels.push({
                      id: 'submod-legacy-' + mod.id,
                      name: 'GENERAL',
                      products: mod.products
                    });
                    delete mod.products;
                  }
                }
              });
            }
          });
        }
      });
    }
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.customers) parsed.customers = [];
    if (!parsed.users) parsed.users = [];
    if (!parsed.categories) parsed.categories = [];
    if (!parsed.storeSettings) {
      parsed.storeSettings = {
        storeName: 'SATOSHIMPORT',
        currency: 'PEN',
        timezone: 'America/Lima',
        paymentMethods: ['yape', 'transfer'],
        notifications: { email: true, push: false },
        regional: { language: 'es', dateFormat: 'DD/MM/YYYY' }
      };
    }
    
    // Force jhosstynn13@gmail.com to be superadmin
    const jhosstynnIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'jhosstynn13@gmail.com' || u.email.toLowerCase() === 'desconocidojijas@gmail.com');
    if (jhosstynnIndex !== -1) {
      parsed.users[jhosstynnIndex].role = 'superadmin';
    }

    // Make sure we save it back if it's jhosstynn
    const satoshiIndex = parsed.users.findIndex((u: User) => u.email.toLowerCase() === 'importsatoshi@hotmail.com');
    if (satoshiIndex === -1) {
      parsed.users.push(starterData.users[1]);
    } else {
      parsed.users[satoshiIndex].role = 'admin';
    }

    // Admins are now dynamically protected by their roles, no hardcoded password resets.

    return parsed;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + "_session");
    return saved ? JSON.parse(saved) : null;
  });

  const activeUser = currentUser 
    ? (data.users.find(u => u.id === currentUser.id) || currentUser) 
    : null;

  useEffect(() => {
    if (!currentUser) {
      loginAsGuest();
    } else {
      // Sync local storage session role with active user role
      if (activeUser && activeUser.role !== currentUser.role) {
        setCurrentUser(activeUser);
        localStorage.setItem(STORAGE_KEY + "_session", JSON.stringify(activeUser));
      }
    }
  }, [currentUser, activeUser]);

  useEffect(() => {
    addLog('SATOSHIMPORT v1.0: Conexión con inventario establecida.', 'success');
  }, []);

  const login = (email: string, password?: string) => {
    const user = data.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      (!u.password || u.password === password)
    );
    if (user) {
      if (user.status === 'suspended') {
        addLog(`Intento de inicio de sesión de usuario suspendido: ${email}`, 'error');
        return { success: false, message: 'Su cuenta ha sido suspendida por seguridad.' };
      }
      
      if (user.role === 'client' && (data.storeSettings?.clientLoginEnabled === false || data.storeSettings?.publicAccessEnabled === false)) {
        addLog(`Intento de inicio de sesión de cliente bloqueado (acceso deshabilitado): ${email}`, 'warning');
        return { success: false, message: 'El acceso para clientes está temporalmente deshabilitado por mantenimiento.' };
      }
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEY + "_session", JSON.stringify(user));
      addLog(`Sesión iniciada: ${user.name} (${user.role.toUpperCase()})`, 'success');
      return { success: true, user };
    }
    addLog(`Fallo de autenticación: ${email}`, 'error');
    return { success: false, message: 'Credenciales incorrectas o identidad no encontrada.' };
  };

  const verifyCredentials = (email: string, password?: string) => {
    const user = data.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!user) {
      return { success: false, message: 'Credenciales incorrectas o identidad no encontrada.' };
    }
    
    if (user.status === 'suspended') {
      return { success: false, message: 'Su cuenta ha sido suspendida por seguridad.' };
    }
    
    if (password && user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }
    
    return { success: true, user };
  };

  const logout = () => {
    addLog(`Sesión terminada para ${currentUser?.name}`, 'info');
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY + "_session");
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'INVITADO',
      firstName: 'INVITADO',
      lastName: 'EXPRESO',
      dni: '00000000',
      phone: '000000000',
      email: 'guest@satoshimport.com',
      role: 'guest',
      createdAt: Date.now()
    };
    addLog('Modo invitado activado (Solo lectura)', 'warn');
    setCurrentUser(guestUser);
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (data.storeSettings?.clientLoginEnabled === false || data.storeSettings?.publicAccessEnabled === false) {
      return { success: false, message: 'El registro de nuevos clientes está temporalmente deshabilitado.' };
    }
    const emailExists = data.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (emailExists) return { success: false, message: 'El correo electrónico ya se encuentra vinculado a una cuenta.' };
    
    const dniExists = data.users.find(u => u.dni === userData.dni);
    if (dniExists) return { success: false, message: 'El DNI ya se encuentra registrado.' };

    const newUser: User = {
      ...userData,
      id: uid(),
      createdAt: Date.now()
    };
    
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    
    addLog(`Nuevo usuario registrado: ${newUser.name} (${newUser.dni})`, 'success');
    return { success: true, user: newUser };
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    data.categories[0]?.id || null
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(
    data.categories[0]?.subcategories[0]?.id || null
  );
  const [selectedModelId, setSelectedModelId] = useState<string | null>(
    data.categories[0]?.subcategories[0]?.models[0]?.id || null
  );
  const setData = (value: CatalogData | ((prev: CatalogData) => CatalogData)) => {
    _setData(prev => {
      const newData = typeof value === 'function' ? value(prev) : value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      // setDoc(doc(db, "catalogs", "main"), JSON.parse(JSON.stringify(newData))); // Disabled to avoid quota issues
      return newData;
    });
  };

  useEffect(() => {
    // Firebase sync disabled temporarily to avoid quota limits
    // const unsub = onSnapshot(doc(db, "catalogs", "main"), (snapshot) => { ... });
    // return () => unsub();
  }, []);

  const [selectedSubmodelId, setSelectedSubmodelId] = useState<string | null>(
    data.categories[0]?.subcategories[0]?.models[0]?.submodels?.[0]?.id || null
  );

  const uid = () => crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2);

  const selectedCategory = useMemo(() => 
    data.categories?.find(c => c.id === selectedCategoryId) || null
  , [data.categories, selectedCategoryId]);

  const selectedSubcategory = useMemo(() => 
    selectedCategory?.subcategories?.find(s => s.id === selectedSubcategoryId) || null
  , [selectedCategory, selectedSubcategoryId]);

  const selectedModel = useMemo(() => 
    selectedSubcategory?.models?.find(m => m.id === selectedModelId) || null
  , [selectedSubcategory, selectedModelId]);

  const selectedSubmodel = useMemo(() => 
    selectedModel?.submodels?.find(s => s.id === selectedSubmodelId) || null
  , [selectedModel, selectedSubmodelId]);

  const allProducts = useMemo(() => {
    const products: (Product & { category: string; subcategory: string; model: string; submodel: string; submodelId: string })[] = [];
    if (!data.categories) return products;
    
    data.categories.forEach(cat => {
      if (!cat.subcategories) return;
      cat.subcategories.forEach(sub => {
        if (!sub.models) return;
        sub.models.forEach(model => {
          if (!model.submodels) return;
          model.submodels.forEach(submodel => {
            if (!submodel.products) return;
            submodel.products.forEach(product => {
              products.push({ ...product, category: cat.name, subcategory: sub.name, model: model.name, submodel: submodel.name, submodelId: submodel.id });
            });
          });
        });
      });
    });
    return products;
  }, [data.categories]);

  const addCategory = (name: string) => {
    const newCat: Category = { id: uid(), name: name.toUpperCase(), subcategories: [] };
    setData(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const deleteCategory = (id: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
      setSelectedSubcategoryId(null);
    }
  };

  const addSubcategory = (categoryId: string, name: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, { id: uid(), name: name.toUpperCase(), models: [] }]
          };
        }
        return cat;
      })
    }));
  };

  const deleteSubcategory = (categoryId: string, subId: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(s => s.id !== subId)
          };
        }
        return cat;
      })
    }));
    if (selectedSubcategoryId === subId) {
      setSelectedSubcategoryId(null);
      setSelectedModelId(null);
    }
  };

  const addModel = (categoryId: string, subId: string, name: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id === subId) {
                return {
                  ...sub,
                  models: [...sub.models, { id: uid(), name: name.toUpperCase(), submodels: [] }]
                };
              }
              return sub;
            })
          };
        }
        return cat;
      })
    }));
  };

  const deleteModel = (categoryId: string, subId: string, modelId: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id === subId) {
                return {
                  ...sub,
                  models: sub.models.filter(m => m.id !== modelId)
                };
              }
              return sub;
            })
          };
        }
        return cat;
      })
    }));
    if (selectedModelId === modelId) {
      setSelectedModelId(null);
    }
  };

  const addSubmodel = (categoryId: string, subId: string, modelId: string, name: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id === subId) {
                return {
                  ...sub,
                  models: sub.models.map(model => {
                    if (model.id === modelId) {
                      return {
                        ...model,
                        submodels: [...model.submodels, { id: uid(), name: name.toUpperCase(), products: [] }]
                      };
                    }
                    return model;
                  })
                };
              }
              return sub;
            })
          };
        }
        return cat;
      })
    }));
  };

  const deleteSubmodel = (categoryId: string, subId: string, modelId: string, submodelId: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub => {
              if (sub.id === subId) {
                return {
                  ...sub,
                  models: sub.models.map(model => {
                    if (model.id === modelId) {
                      return {
                        ...model,
                        submodels: model.submodels.filter(s => s.id !== submodelId)
                      };
                    }
                    return model;
                  })
                };
              }
              return sub;
            })
          };
        }
        return cat;
      })
    }));
    if (selectedSubmodelId === submodelId) {
      setSelectedSubmodelId(null);
    }
  };

  const addProduct = (submodelId: string, productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: uid(),
      createdAt: Date.now(),
      sizes: productData.sizes || [],
      status: productData.status || 'active'
    };

    addLog(`Producto añadido: ${newProduct.name} - SKU: ${newProduct.sku}`, 'success');

    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: sub.models.map(model => {
            return {
              ...model,
              submodels: model.submodels.map(submodel => {
                if (submodel.id === submodelId) {
                  return {
                    ...submodel,
                    products: [...submodel.products, newProduct]
                  };
                }
                return submodel;
              })
            };
          })
        }))
      }))
    }));
  };


  const addProductsBulk = (submodelId: string, productsData: Omit<Product, 'id' | 'createdAt'>[]) => {
    const newProducts = productsData.map(productData => ({
      ...productData,
      id: uid(),
      createdAt: Date.now(),
      sizes: productData.sizes || [],
      status: productData.status || 'active'
    }));

    addLog(`Añadidos ${newProducts.length} productos masivamente`, 'success');

    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: sub.models.map(model => {
            return {
              ...model,
              submodels: model.submodels.map(submodel => {
                if (submodel.id === submodelId) {
                  return {
                    ...submodel,
                    products: [...submodel.products, ...newProducts]
                  };
                }
                return submodel;
              })
            };
          })
        }))
      }))
    }));
  };
  const updateProduct = (submodelId: string, productId: string, productData: Partial<Product>) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: sub.models.map(model => {
            return {
              ...model,
              submodels: model.submodels.map(submodel => {
                if (submodel.id === submodelId) {
                  return {
                    ...submodel,
                    products: submodel.products.map(p => p.id === productId ? { ...p, ...productData } : p)
                  };
                }
                return submodel;
              })
            };
          })
        }))
      }))
    }));
  };

  const deleteProduct = (submodelId: string | null, productId: string) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => ({
          ...sub,
          models: sub.models.map(model => {
            return {
              ...model,
              submodels: model.submodels.map(submodel => {
                if (!submodelId || submodel.id === submodelId) {
                  return {
                    ...submodel,
                    products: submodel.products.filter(p => p.id !== productId)
                  };
                }
                return submodel;
              })
            };
          })
        }))
      }))
    }));
    addLog(`Producto eliminado temporalmente de la vista local.`, 'warn');
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setData(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder]
    }));
    return newOrder;
  };

  const updateOrder = (orderId: string, update: Partial<Order>) => {
    addLog(`Orden ${orderId} actualizada a estado: ${update.status || 'MODIFICADO'}`, 'info');
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { ...o, ...update, updatedAt: Date.now() } : o)
    }));
  };

  const deleteOrder = (orderId: string) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(o => o.id !== orderId)
    }));
  };

  const updateCustomer = (customerId: string, update: Partial<Customer>) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.map(c => c.id === customerId ? { ...c, ...update } : c)
    }));
  };

  const deleteCustomer = (customerId: string) => {
    setData(prev => ({
      ...prev,
      customers: prev.customers.filter(c => c.id !== customerId)
    }));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: uid(),
      createdAt: Date.now()
    };
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const updateUser = (userId: string, update: Partial<User>) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, ...update } : u)
    }));
  };

  const deleteUser = (userId: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));
  };

  const importCsv = (text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let imported = 0;
    const newData = { ...data };

    lines.forEach(line => {
      const parts = parseCsvLine(line);
      const [category, subcategory, name, price, sku, image, ...descParts] = parts;
      if (!category || !subcategory || !name || !price) return;

      let cat = newData.categories.find(c => c.name.toUpperCase() === category.trim().toUpperCase());
      if (!cat) {
        cat = { id: uid(), name: category.trim().toUpperCase(), subcategories: [] };
        newData.categories.push(cat);
      }

      let sub = cat.subcategories.find(s => s.name.toUpperCase() === subcategory.trim().toUpperCase());
      if (!sub) {
        sub = { id: uid(), name: subcategory.trim().toUpperCase(), models: [] };
        cat.subcategories.push(sub);
      }

      // Ensure a model exists (we'll name it GENERAL if not specified or just use first one)
      let model = sub.models.find(m => m.name === 'GENERAL');
      if (!model) {
        model = { id: uid(), name: 'GENERAL', products: [] };
        sub.models.push(model);
      }

      model.products.push({
        id: uid(),
        name: name.trim(),
        price: Number(price),
        sku: (sku || '').trim(),
        image: (image || '').trim(),
        description: descParts.join(',').trim(),
        createdAt: Date.now(),
        sizes: (line.split(',')[6] || '').split('|').map(s => s.trim()).filter(s => s),
        status: 'active'
      });
      imported++;
    });

    setData({ ...newData });
    return imported;
  };

  const clearAll = () => {
    setData(prev => ({
      ...prev,
      categories: [],
      orders: [],
      customers: [],
      users: prev.users.filter(u => u.role === 'admin')
    }));
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setSelectedModelId(null);
    setSelectedSubmodelId(null);
  };

  const loadMassiveDemo = () => {
    try {
      addLog('Iniciando generación masiva de datos (Productos/Clientes/Órdenes)...', 'process');
      const demoData: CatalogData = JSON.parse(JSON.stringify(starterData));
      
      const categoriesList = ['NIKE', 'ADIDAS', 'PUMA', 'JORDAN', 'REEBOK', 'NEW BALANCE'];
      const typesList = ['RUNNING', 'TRAINING', 'STREET', 'RETRO', 'ELITE'];
      const allDemoProducts: Product[] = [];
      
      demoData.categories.forEach(cat => {
        cat.subcategories.forEach(sub => {
          sub.models.forEach(model => {
            for (let i = 0; i < 10; i++) {
              const brand = categoriesList[Math.floor(Math.random() * categoriesList.length)];
              const type = typesList[Math.floor(Math.random() * typesList.length)];
              const id = `p-demo-${cat.id}-${sub.id}-${model.id}-${i}`;
              const newP: Product = {
                id,
                name: `${brand} ${type} ${i + 1} PRO`,
                price: Math.floor(Math.random() * 800) + 150,
                sku: `${brand.slice(0,2)}-${cat.name.slice(0,1)}${sub.name.slice(0,1)}-${i}`,
                image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=400`,
                description: `Calzado de alto rendimiento con tecnología ${brand} Vision.`,
                createdAt: Date.now() - Math.floor(Math.random() * 10000000),
                sizes: ['38', '39', '40', '41', '42'],
                status: 'active'
              };
              model.products.push(newP);
              allDemoProducts.push(newP);
            }
          });
        });
      });

      for (let i = 0; i < 30; i++) {
        demoData.customers.push({
          id: `cust-demo-${i}`,
          name: `Cliente Demo ${i + 1}`,
          email: `cliente${i + 1}@demo.com`,
          phone: `9${Math.floor(Math.random() * 100000000)}`,
          createdAt: Date.now() - Math.floor(Math.random() * 50000000),
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: 0
        });
      }

      const statuses: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled', 'returned'];
      for (let i = 0; i < 50; i++) {
        const customer = demoData.customers[Math.floor(Math.random() * demoData.customers.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const itemsCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let total = 0;
        for(let j = 0; j < itemsCount; j++) {
          const p = allDemoProducts[Math.floor(Math.random() * allDemoProducts.length)];
          if (p) {
            const qty = Math.floor(Math.random() * 2) + 1;
            items.push({
              productId: p.id,
              name: p.name,
              quantity: qty,
              price: p.price
            });
            total += p.price * qty;
          }
        }

        demoData.orders.push({
          id: `ord-demo-${i}`,
          customerId: customer.id,
          customerName: customer.name,
          items,
          total,
          status,
          createdAt: Date.now() - Math.floor(Math.random() * (20 * 24 * 60 * 60 * 1000)),
          updatedAt: Date.now() - Math.floor(Math.random() * (2 * 60 * 60 * 1000))
        });
      }

      setData(demoData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
      addLog('Carga masiva completada exitosamente. 50 órdenes generadas.', 'success');

      if (demoData.categories[0]) {
        setSelectedCategoryId(demoData.categories[0].id);
        if (demoData.categories[0].subcategories[0]) {
          setSelectedSubcategoryId(demoData.categories[0].subcategories[0].id);
        }
      }
      
      alert('¡Sistema actualizado con éxito! Se han generado productos, clientes y órdenes de prueba.');
    } catch (err) {
      console.error("Error generating demo data:", err);
      alert('Error al generar datos: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const importJson = (json: string) => {
    try {
      const imported = JSON.parse(json);
      if (imported.categories) {
        setData(imported);
        setSelectedCategoryId(imported.categories[0]?.id || null);
        setSelectedSubcategoryId(imported.categories[0]?.subcategories[0]?.id || null);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const requestPasswordChange = async (email: string) => {
    try {
      const code = generateCode();
      setVerificationCode(code);
      
      await sendVerificationCode(email, code);
      addLog(`CÓDIGO DE PROTOCOLO ENVIADO A ${email}`, 'warn');
      return { success: true };
    } catch (error) {
      console.error('Error requesting password change:', error);
      addLog('Error al enviar el código de verificación.', 'error');
      return { success: false, message: 'No se pudo enviar el código.' };
    }
  };

  const confirmPasswordChange = (userId: string, currentPass: string, newPass: string, code: string) => {
    if (!verificationCode || code.trim().toUpperCase() !== verificationCode.trim().toUpperCase()) {
      addLog('Error: Código de verificación inválido.', 'error');
      return { success: false, message: 'Código de verificación incorrecto.' };
    }

    const user = data.users.find(u => u.id === userId);
    if (!user || user.password !== currentPass) {
      addLog('Error: Contraseña actual incorrecta.', 'error');
      return { success: false, message: 'La contraseña actual no coincide.' };
    }

    updateUser(userId, { password: newPass });
    setVerificationCode(null);
    addLog(`Contraseña actualizada para ${user.name}`, 'success');
    return { success: true };
  };


  const updateStoreSettings = (newSettings: any) => {
    setData(prev => ({
      ...prev,
      storeSettings: {
        ...(prev.storeSettings || {
          storeName: 'SATOSHIMPORT',
          currency: 'PEN',
          timezone: 'America/Lima',
          paymentMethods: ['yape', 'transfer'],
          notifications: { email: true, push: false },
          regional: { language: 'es', dateFormat: 'DD/MM/YYYY' }
        }),
        ...newSettings
      }
    }));
    addLog('Ajustes globales actualizados exitosamente.', 'success');
  };
  return {
    data,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    selectedModelId,
    setSelectedModelId,
    selectedSubmodelId,
    setSelectedSubmodelId,
    selectedCategory,
    selectedSubcategory,
    selectedModel,
    selectedSubmodel,
    allProducts,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
    addModel,
    deleteModel,
    addSubmodel,
    deleteSubmodel,
    addProduct,
    addProductsBulk,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrder,
    deleteOrder,
    updateCustomer,
    deleteCustomer,
    addUser,
    updateUser,
    deleteUser,
    login,
    verifyCredentials,
    logout,
    loginAsGuest,
    register,
    currentUser: activeUser,
    importCsv,
    clearAll,
    loadMassiveDemo,
    importJson,
    requestPasswordChange,
    confirmPasswordChange,
    updateStoreSettings
  };
}

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
