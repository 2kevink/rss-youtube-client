import start from "./functions.js";
start();
const button = document.getElementsByTagName("button")[0];
const input = document.getElementsByTagName("input")[0];
const news = document.getElementsByClassName("news")[0];
let nextPageToken;
button.addEventListener("click",add);

let isDown = false; 
let startX;
let scrollLeft;

news.addEventListener("mousedown", (e) => {
    isDown = true;
    news.classList.add('active');
    startX = e.pageX - news.offsetLeft;
    scrollLeft = news.scrollLeft;
})

news.addEventListener("mouseleave", () => {
    isDown = false;
    news.classList.remove('active');
})

news.addEventListener("mouseup", () => {
    isDown = false;
    news.classList.remove('active');
})

news.addEventListener("click",() => {
    if(news.scrollWidth-news.scrollLeft<window.innerWidth*3) {
        addWithToken();
    }
})

news.addEventListener("mousemove", (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - news.offsetLeft;
    const walk = x - startX;
    //news.scrollLeft = scrollLeft - walk;
    if(walk>0){
        news.scrollBy(-window.innerWidth,0);
    }
    else if(walk<0){
        news.scrollBy(window.innerWidth,0);
    }
     
})
function add() {  
    fetch (`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDLkVWQjtJ2TvuA1sH_jM0osFrvsDW33NQ&type=video&part=snippet&maxResults=15&q=${input.value}`)
    .then((res)=> res.json())
    .then(res=> {
        let arr = [];
        nextPageToken = res.nextPageToken;
        for (let i of res.items){
        arr.push(i.id.videoId) ;      
        }
        return  fetch (`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDLkVWQjtJ2TvuA1sH_jM0osFrvsDW33NQ&id=${arr.join(',')}&part=snippet,statistics`)
    })
    .then((res)=>res.json())
    .then((res)=>{
        let arr2 = [];
        for (let i of res.items){
            arr2.push({'title': i.snippet.title, 'author': i.snippet.channelTitle, 'publishedAt': i.snippet.publishedAt,
                    'description': i.snippet.description, 'picture': i.snippet.thumbnails.medium.url,
                    'viewCount': i.statistics.viewCount});
        }
        render(arr2,false)
    })
}

function addWithToken(pageToken) {  
    fetch (`https://www.googleapis.com/youtube/v3/search?pageToken=${nextPageToken}&key=AIzaSyDLkVWQjtJ2TvuA1sH_jM0osFrvsDW33NQ&type=video&part=snippet&maxResults=15&q=${input.value}`)
    .then((res)=> res.json())
    .then(res=> {
        let arr = [];
        nextPageToken = res.nextPageToken;  
        for (let i of res.items){
        arr.push(i.id.videoId) ;      
        }
        return  fetch (`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDLkVWQjtJ2TvuA1sH_jM0osFrvsDW33NQ&id=${arr.join(',')}&part=snippet,statistics`)
    })
    .then((res)=>res.json())
    .then((res)=>{
        let arr2 = [];
        for (let i of res.items){
            arr2.push({'title': i.snippet.title, 'author': i.snippet.channelTitle, 'publishedAt': i.snippet.publishedAt,
                    'description': i.snippet.description, 'picture': i.snippet.thumbnails.medium.url,
                    'viewCount': i.statistics.viewCount});
        }
        render(arr2)
    })
}


function render(somearr,token) {
    let container = document.querySelector('.news');
    if(token===false){
        container.innerHTML = ``;
    }
    for (let article of somearr) {
        container.innerHTML += `
            <section class="news-block">
                <img src="${article.picture}">
                <span class="news-date"> Published: ${article.publishedAt}</span><br>
                <span class="news-views"> Views: ${article.viewCount}.</span><br>
                <span class="news-author"> Author: ${article.author}</span>
                <header class="news-desc">${article.title}</header>
                
                <p class="news-text">${article.description}</p>
            </section>
        `
    }
    
}
