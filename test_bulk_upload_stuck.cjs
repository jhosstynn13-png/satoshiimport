// It looks like `isUploading` is getting stuck at true because of an unhandled error inside `handleBulkUpload` 
// or because `compressImage` is failing, or Firebase Storage is failing.
// Wait, if Firebase Storage is not configured properly, `uploadBytes` or `ref` might fail.
// Is `storage` imported and initialized correctly? Let's check `src/lib/firebase.ts` or similar.
