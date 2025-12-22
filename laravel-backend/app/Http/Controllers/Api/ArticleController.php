<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Article::orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return Article::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Article::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $article = Article::findOrFail($id);
        $article->update($request->all());
        return $article;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Article::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // /api/articles/latest route to get the latest article
    public function latest()
    {
        $article =  Article::where('status', 'original')->orderBy('created_at', 'desc')->first();
        return $article;
    }

    public function updated($id)
    {
        $article = Article::where('parent_id', $id)
            ->where('status', 'updated')
            ->orderBy('created_at', 'desc')
            ->first();
        return $article;
    }

}
