<?php
class error404Controller extends baseController
{

	public function index()
	{

		header('Content-Type: application/json');
		http_response_code(404);
		echo json_encode(
			array(
				'success' => false,
				'message' => "404 - Not found."
			)
		);
		exit;
	}
}
