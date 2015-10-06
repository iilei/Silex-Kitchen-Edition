module.exports = {
  sass: {
    src: 'resources/assets/scss/**/*.{sass,scss}',
    dest: 'web/css',
    options: {
      noCache: true,
      compass: false,
      bundleExec: false,
      sourcemap: false,
      style: 'expanded'
    }
  }
};
