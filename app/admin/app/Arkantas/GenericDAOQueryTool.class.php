<?php
trait GenericDAOQueryTool
{
    public static $dao;
    public static $entity;

    public static function get($where, $fields = "*", $order = "", $firstLimit = "", $maxLimit = "", $offsetSql = "")
    {

        self::$dao = new GenericDAO;
        self::$dao->setEntity(self::$entity);

        $limit = "";
        $offset = "";
        if ($order != "") {
            $order = " ORDER BY " . $order;
        }
        if (is_numeric($firstLimit)) {
            $limit = " LIMIT " . $firstLimit;
        }
        if (is_numeric($firstLimit) && is_numeric($maxLimit)) {
            $limit = " LIMIT " . $firstLimit . "," . $maxLimit;
        }
        if (is_numeric($offsetSql)) {
            $offset = " OFFSET " . $offsetSql;
        }

        return self::$dao->getListByField($fields, $where . $order . $limit . $offset);
    }

    public static function getInner($where, $fields = "*", $inner = "", $order = "", $firstLimit = "", $maxLimit = "", $offsetSql = "")
    {

        self::$dao = new GenericDAO;
        self::$dao->setEntity(self::$entity);

        $limit = "";
        $offset = "";
        if ($order != "") {
            $order = " ORDER BY " . $order;
        }
        if (is_numeric($firstLimit)) {
            $limit = " LIMIT " . $firstLimit;
        }
        if (is_numeric($firstLimit) && is_numeric($maxLimit)) {
            $limit = " LIMIT " . $firstLimit . "," . $maxLimit;
        }
        if (is_numeric($offsetSql)) {
            $offset = " OFFSET " . $offsetSql;
        }

        return self::$dao->getListInner($fields, $inner, $where . $order . $limit . $offset, "S");
    }

    public static function having($where, $fields = "*", $inner = "", $order = "", $firstLimit = "", $maxLimit = "", $offsetSql = "")
    {

        self::$dao = new GenericDAO;
        self::$dao->setEntity(self::$entity);

        $limit = "";
        $offset = "";
        if ($order != "") {
            $order = " ORDER BY " . $order;
        }
        if (is_numeric($firstLimit)) {
            $limit = " LIMIT " . $firstLimit;
        }
        if (is_numeric($firstLimit) && is_numeric($maxLimit)) {
            $limit = " LIMIT " . $firstLimit . "," . $maxLimit;
        }
        if (is_numeric($offsetSql)) {
            $offset = " OFFSET " . $offsetSql;
        }

        return self::$dao->getListByFieldHaving($fields, $where . $order . $limit . $offset, $inner);
    }

    public static function isFieldExisting($field, $value)
    {
        $l = self::get($field . "='" . $value . "'", $field);
        return ($l->size() > 0) ? 1 : 0;
    }
}
