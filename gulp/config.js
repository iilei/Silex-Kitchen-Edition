module.exports = {
  sass: {
    src: 'resources/assets/scss/style.scss',
    dest: 'web/css',
    options: {
      noCache: true,
      compass: true,
      bundleExec: false,
      sourcemap: false,
      style: 'expanded',
      loadPath: ['./bower_components/bootstrap-sass/assets/stylesheets'],
      trace: true
    }
  }
};
