<?php

use App\Http\Controllers\Api\ArticleController;
use Illuminate\Support\Facades\Route;
Route::get('/run-scraper', function () {
    if (request('key') !== env('SCRAPER_SECRET')) {
        abort(403);
    }

    Artisan::call('scrape:oldest-blogs');

    return response()->json([
        'status' => 'Scraper executed'
    ]);
});
Route::get('articles/latest', [ArticleController::class, 'latest']);
Route::get('articles/{id}/compare', [ArticleController::class, 'compare']);
Route::get('articles/{id}/updated', [ArticleController::class, 'updated']);
Route::apiResource('articles', ArticleController::class);
