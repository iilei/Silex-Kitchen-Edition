<?php

namespace SKE\Composer;

class Script
{
    public static function install()
    {
        chmod('resources/cache', 0777);
        chmod('resources/log', 0777);
        chmod('web/assets', 0777);
        chmod('console', 0500);
        exec('npm install "gulpjs/gulp#4.0" -g');
        exec('gulp');
    }
}
