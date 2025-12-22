<?php

use App\Http\Controllers\Api\ArticleController;
use Illuminate\Support\Facades\Route;
Route::get('articles/latest', [ArticleController::class, 'latest']);
Route::apiResource('articles', ArticleController::class);
