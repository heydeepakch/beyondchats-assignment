<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use App\Models\Article;

class ScrapeOldestBlogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scrape:oldest-blogs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape the 5 oldest articles from BeyondChats blog';

    /**
     * Execute the console command.
     */
    public function handle()
    {$client = new Client([
        'timeout' => 10,
        'headers' => [
            'User-Agent' => 'Mozilla/5.0'
        ]
    ]);

        $this->info('Fetching blogs page...');
        $response = $client->get('https://beyondchats.com/blogs/');
        $html = (string) $response->getBody();
        $crawler = new Crawler($html);

        // get last page number
        $pageNumbers = $crawler->filter('a')->each(function ($node) {
            return $node->text();
        });
        $lastPage = max(array_filter($pageNumbers, 'is_numeric'));
        $this->info("Last page detected: {$lastPage}");
        
        // start from last page and get 5 oldest articles
        $allArticleLinks = [];
        $currentPage = $lastPage; 

        while (count($allArticleLinks) < 5 && $currentPage>=1) {
            $pageUrl = "https://beyondchats.com/blogs/page/{$currentPage}/";
    
            $this->info("Fetching articles from page {$currentPage}...");
    
            $response = $client->get($pageUrl);
            $html = (string) $response->getBody();
            $crawler = new Crawler($html);

            $pageArticleLinks = $crawler->filter('h2.entry-title a')->each      (function (Crawler $node) {
                return $node->attr('href');
            });
    
            $pageArticleLinks = array_values(array_unique(array_filter($pageArticleLinks)));
    
            $allArticleLinks = array_merge($allArticleLinks, $pageArticleLinks);
    
            $allArticleLinks = array_values(array_unique($allArticleLinks));
    
            $this->info("Found " . count($pageArticleLinks) . " articles on page {$currentPage}. Total: " . count($allArticleLinks));
    
            $currentPage--;
        }

        $articleLinks = array_slice($allArticleLinks, 0, 5);
        $this->info('Selected ' . count($articleLinks) . ' oldest articles to scrape.');
        
        // go through each article links one by one and fetch title and contents
        $count = 0;
        foreach ($articleLinks as $url) {

            // check if any article already exist in DB so we can skip it
            if (Article::where('source_url', $url)->where('status', 'original')->exists()) {
            continue;
            }

            $this->info("Scraping: {$url}");

            $articleResponse = $client->get($url);
            $articleHtml = (string) $articleResponse->getBody();
            $articleCrawler = new Crawler($articleHtml);

            $title = $articleCrawler->filter('h1')->first()->text();
            
            // getting content of article by selecting the div and its diffrent tags
            $section = $articleCrawler->filter('div[data-id="b2a436b"]');
            $texts = $section->filter('p, h2, h3')->each(
                fn (Crawler $node) => trim($node->text())
            );
            
            $content = implode("\n\n", $texts); 
            // $content = $articleCrawler->filter('article')->text();
            

            // feed to DB
            Article::create([
                'title' => $title,
                'content' => trim($content),
                'source_url' => $url,
                'status' => 'original',
                'parent_id' => null,
            ]);

            $count++;
        }

        $this->info("Scraping completed. {$count} articles stored.");
    }
}
