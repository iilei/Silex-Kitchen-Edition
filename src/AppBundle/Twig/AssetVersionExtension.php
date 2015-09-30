<?php

namespace AppBundle\Twig;

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
