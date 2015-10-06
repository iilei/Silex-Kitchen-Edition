sass: {
  src:  '/resources/assets/scss/**/*.{sass,scss}',
  dest: '/web/css',
  options: {
    noCache: true,
    compass: false,
    bundleExec: true,
    sourcemap: true,
    sourcemapPath: '/web/css',
    style: 'expanded'
  }
}
