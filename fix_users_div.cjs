const fs = require('fs');
let code = fs.readFileSync('src/components/Users.tsx', 'utf8');

code = code.replace(
  `                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      {/* Form Modal */}`,
  `                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>

      {/* Form Modal */}`
);

fs.writeFileSync('src/components/Users.tsx', code);
