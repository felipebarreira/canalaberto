<?php
require(realpath(dirname(__FILE__)) . '/' . 'SplClassLoader.class.php');

class ClassLoader
{

    public $path;
    public static $instance;

    private $_src = array(
        '/app/',
        '/app/Arkantas/',
    );

    private $_ext = array('.php', '.class.php');

    /* initialize the autoloader class */
    public static function init()
    {
        if (self::$instance == null)
            self::$instance = new self();

        $loader = new SplClassLoader('Complaint', PATH . PATH_ADMIN . '/app');
        $loader->register();

        // itself when its part of model
        $loader = new SplClassLoader('Base', PATH . PATH_ADMIN . '/app');
        $loader->register();

        return self::$instance;
    }

    /* put the custom functions in the autoload register when the class is initialized */
    private function __construct()
    {
        $this->path = PATH . "/" . PATH_ADMIN;
        spl_autoload_register(array($this, 'clean'));
        spl_autoload_register(array($this, 'dirty'));
    }

    /* the clean method to autoload the class without any includes, works in most cases */
    private function clean($class)
    {
        //$class=str_replace('_', '/', $class);
        spl_autoload_extensions(implode(',', $this->_ext));
        foreach ($this->_src as $resource) {
            set_include_path($this->path . $resource);
            spl_autoload($class);
        }
    }

    /* the dirty method to autoload the class after including the php file containing the class */
    private function dirty($class)
    {
        //$class = str_replace('_', '/', $class);
        foreach ($this->_src as $resource) {
            foreach ($this->_ext as $ext) {
                if (file_exists($this->path . $resource . $class . $ext))
                    require_once($this->path . $resource . $class . $ext);
            }
        }
        spl_autoload($class);
    }
}

ClassLoader::init();
