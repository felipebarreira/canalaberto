<?php
namespace Component\Helpers;
use \PhpOffice\PhpSpreadsheet\IOFactory;

class Excel{

	public static function fieldsBySheet($file, $sheet){

		$inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($file);
		$objReader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
		$objPHPExcel = $objReader->load($file);

		//  Get worksheet dimensions
		$sheet = $objPHPExcel->getSheet($sheet); 
		$highestRow = $sheet->getHighestRow(); 
		$highestColumn = $sheet->getHighestColumn();
		$rows = array();
		//  Loop through each row of the worksheet in turn
		
		//  Read a row of data into an array
		$rowData = $sheet->rangeToArray('A' . 1 . ':' . $highestColumn . 1,
		                                    NULL,
		                                    TRUE,
		                                    FALSE);

		return $rowData[0];
	}

	public static function fields($file){

		$inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($file);
		$objReader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
		$objPHPExcel = $objReader->load($file);

		//  Get worksheet dimensions
		$sheet = $objPHPExcel->getSheet(0); 
		$highestRow = $sheet->getHighestRow(); 
		$highestColumn = $sheet->getHighestColumn();
		$rows = array();
		//  Loop through each row of the worksheet in turn
		
		//  Read a row of data into an array
		$rowData = $sheet->rangeToArray('A' . 1 . ':' . $highestColumn . 1,
		                                    NULL,
		                                    TRUE,
		                                    FALSE);

		return $rowData[0];
	}

	public static function rowsBySheet($file, $sheet){

		$inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($file);
		$objReader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
		$objReader->setReadDataOnly(true);
		$objPHPExcel = $objReader->load($file);

		//  Get worksheet dimensions
		$sheet = $objPHPExcel->getSheet($sheet); 
		$highestRow = $sheet->getHighestRow(); 
		$highestColumn = $sheet->getHighestColumn();
		$rows = array();
		//  Loop through each row of the worksheet in turn
		for ($row = 1; $row <= $highestRow; $row++){ 
		    //  Read a row of data into an array
		    $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
		                                    NULL,
		                                    TRUE,
		                                    FALSE);

		    array_push($rows, $rowData[0]);
		}

		//
		$headings = array_shift($rows);
		array_walk(
		    $rows,
		    function (&$row) use ($headings) {
		        $row = array_combine($headings, $row);
		    }
		);


		return $rows;
	}

	public static function highestRow($file, $sheet){

		$inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($file);
		$objReader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
		$objReader->setReadDataOnly(true);
		$objPHPExcel = $objReader->load($file);

		//  Get worksheet dimensions
		$sheet = $objPHPExcel->getSheet($sheet); 
		$highestRow = $sheet->getHighestRow(); 

		return $highestRow;
	}

	public static function rows($file){

		$inputFileType = \PhpOffice\PhpSpreadsheet\IOFactory::identify($file);
		$objReader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
		$objPHPExcel = $objReader->load($file);

		//  Get worksheet dimensions
		$sheet = $objPHPExcel->getSheet(0); 
		$highestRow = $sheet->getHighestRow(); 
		$highestColumn = $sheet->getHighestColumn();
		$rows = array();
		//  Loop through each row of the worksheet in turn
		for ($row = 1; $row <= $highestRow; $row++){ 
		    //  Read a row of data into an array
		    $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
		                                    NULL,
		                                    TRUE,
		                                    FALSE);

		    array_push($rows, $rowData[0]);
		}

		//
		$headings = array_shift($rows);
		array_walk(
		    $rows,
		    function (&$row) use ($headings) {
		        $row = array_combine($headings, $row);
		    }
		);


		return $rows;
	}

}
?>