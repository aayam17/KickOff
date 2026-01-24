
**Before**:
```javascript
export default defineConfig({
  plugins: [react()],
})
```

**After**:
```javascript
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    build: {
      // CRITICAL: Disable source maps
      sourcemap: false,
      
      // Minification with Terser
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          dead_code: true,
          passes: 2,
        },
        mangle: { safari10: true },
        format: { comments: false },
      },
      
      // Code splitting optimization
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      
      chunkSizeWarningLimit: 1000,
    },
    
    // Security headers
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },
    },
  }
})
```

**Impact**: 
- ✅ No `.map` files generated in production
- ✅ Code minified and obfuscated
- ✅ Console logs removed automatically
- ✅ Debugger statements stripped
- ✅ Security headers added

---

#### 2. `/backend/app.js` ⭐ SECURITY ENHANCEMENT
**What changed**: Added production security measures

**Key Additions**:
```javascript
// Hide Express framework
app.disable("x-powered-by");

// Environment-based CORS
const isProduction = process.env.NODE_ENV === "production";
const corsOptions = {
  origin: isProduction 
    ? process.env.FRONTEND_URL 
    : ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// Production error handling (no stack traces)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: isProduction ? "Internal server error" : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});
```

**Impact**:
- ✅ Express framework hidden from attackers
- ✅ Proper CORS configuration per environment
- ✅ Multiple security headers preventing common attacks
- ✅ No error details leaked in production

---

