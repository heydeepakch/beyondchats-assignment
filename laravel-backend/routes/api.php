<?php

use App\Http\Controllers\Api\ArticleController;
use Illuminate\Support\Facades\Route;
Route::get('articles/latest', [ArticleController::class, 'latest']);
Route::get('articles/{id}/compare', [ArticleController::class, 'compare']);
Route::get('articles/{id}/updated', [ArticleController::class, 'updated']);
Route::apiResource('articles', ArticleController::class);
