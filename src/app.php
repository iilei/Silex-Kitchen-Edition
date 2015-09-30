<?php

use Silex\Provider\FormServiceProvider;
use Silex\Provider\HttpCacheServiceProvider;
use Silex\Provider\MonologServiceProvider;
use Silex\Provider\SecurityServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\TranslationServiceProvider;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Silex\Provider\WebProfilerServiceProvider;
use Symfony\Component\Security\Core\Encoder\PlaintextPasswordEncoder;
use Symfony\Component\Translation\Loader\YamlFileLoader;
# use Symfony\Component\Templating\Asset\PathPackage;

# use AppBundle\Twig\AssetVersionExtension;


$app->register(new HttpCacheServiceProvider());

$app->register(new SessionServiceProvider());
$app->register(new ValidatorServiceProvider());
$app->register(new FormServiceProvider());
$app->register(new UrlGeneratorServiceProvider());

$app->register(new Silex\Provider\HttpFragmentServiceProvider());

# $app->register(new AppBundle\Twig\AssetVersionExtension());
################################################################# CLEANUP!
class AssetVersionExtension extends \Twig_Extension
{
    public function __construct()
    {
        $this->appDir = __DIR__ ;
    }

    public function getFilters()
    {
      return array(
	        new \Twig_SimpleFilter('asset_version', array($this, 'getAssetVersion')),
      );
    }

    public function getName()
    {
        return 'asset_version_extension';
    }

    /**
     * Logic for the "asset" function of Twig
     *
     * @param type $url
     * @param type $version
     * @return type
     */
    public function asset($url)
    {
        // $versionToUse = $this->version;
        // if($version !== NULL)
        //     $versionToUse = $version;
        //
        # $assetPath = $this->directory.'/'.ltrim($url, '/');
        // $assetPath.= $versionToUse !== NULL ? '?v='.$versionToUse : '';
        return $url;
    }

    public function getFunctions()
    {
        return array(
            'asset' => new \Twig_Function_Method($this, 'asset'),
        );
    }

    public function getAssetVersion($filename)
 	  {
          $manifestPath = $this->appDir.'/../resources/assets/rev-manifest.json';

          if (!file_exists($manifestPath)) {
              throw new \Exception(sprintf('Cannot find manifest file: "%s"', $manifestPath));
          }

          $paths = json_decode(file_get_contents($manifestPath), true);

          if (!isset($paths[$filename])) {
              throw new \Exception(sprintf('There is no file "%s" in the version manifest!', $filename));
          }

          return $paths[$filename];
    }
}
################################################################# /CLEANUP!

$app->register(new SecurityServiceProvider(), array(
    'security.firewalls' => array(
        'admin' => array(
            'pattern' => '^/',
            'form'    => array(
                'login_path'         => '/login',
                'username_parameter' => 'form[username]',
                'password_parameter' => 'form[password]',
            ),
            'logout'    => true,
            'anonymous' => true,
            'users'     => $app['security.users'],
        ),
    ),
));

$app['security.encoder.digest'] = $app->share(function ($app) {
    return new PlaintextPasswordEncoder();
});

$app->register(new TranslationServiceProvider());
$app['translator'] = $app->share($app->extend('translator', function ($translator, $app) {
    $translator->addLoader('yaml', new YamlFileLoader());

    $translator->addResource('yaml', __DIR__.'/../resources/locales/fr.yml', 'fr');

    return $translator;
}));

$app->register(new MonologServiceProvider(), array(
    'monolog.logfile' => __DIR__.'/../resources/log/app.log',
    'monolog.name'    => 'app',
    'monolog.level'   => 300 // = Logger::WARNING
));

$app->register(new TwigServiceProvider(), array(
    'twig.options'        => array(
        'cache'            => isset($app['twig.options.cache']) ? $app['twig.options.cache'] : false,
        'strict_variables' => true
    ),
    'twig.form.templates' => array('form_div_layout.html.twig', 'common/form_div_layout.html.twig'),
    'twig.path'           => array(__DIR__ . '/../resources/views')
));

$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {
    $twig->addExtension(new AssetVersionExtension($app));

    return $twig;
}));


if ($app['debug'] && isset($app['cache.path'])) {
    $app->register(new ServiceControllerServiceProvider());
    $app->register(new WebProfilerServiceProvider(), array(
        'profiler.cache_dir' => $app['cache.path'].'/profiler',
    ));
}

$app->register(new Silex\Provider\DoctrineServiceProvider());

return $app;
