<?php

namespace SKE\Composer;

class Script
{
    public static function install()
    {
        chmod('resources/cache', 0777);
        chmod('resources/log', 0777);
        chmod('web/img', 0777);
        chmod('web/js', 0777);
        chmod('web/css', 0777);
        chmod('console', 0500);
        exec('npm install "gulpjs/gulp#4.0" -g');
        exec('bower install');
        exec('gulp');
    }
}
