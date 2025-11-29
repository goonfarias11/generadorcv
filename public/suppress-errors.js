// Suprimir errores conocidos de React (toolbar de Vercel)
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args) => {
    const errorString = args.join(' ');
    
    // Ignorar errores conocidos del toolbar de Vercel
    if (
      errorString.includes('Minified React error #425') ||
      errorString.includes('Minified React error #418') ||
      errorString.includes('Minified React error #423') ||
      errorString.includes('vercel.live') ||
      errorString.includes('deprecated parameters for the initialization function')
    ) {
      return;
    }
    
    originalError.apply(console, args);
  };
}
