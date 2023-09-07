<?php

use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

class SerializerJsonResponse
{

	public static function params()
	{
		// Crie um encoder para lidar com a codificação/descodificação JSON
		$encoder = new JsonEncoder();

		// Crie um objeto normalizer para transformar o JSON em um array associativo
		$normalizer = new ObjectNormalizer();

		// Crie uma instância do Symfony Serializer com o normalizer e o encoder
		$serializer = new Serializer([$normalizer], [$encoder]);

		// Recebe o JSON do corpo da requisição
		$jsonData = file_get_contents('php://input');

		// Deserializa o JSON para um array associativo
		$params = $serializer->decode($jsonData, 'json');

		return $params;
	}
}
