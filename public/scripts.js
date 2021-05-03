

//Infinite scroll -- lazy loading
const container = document.getElementById('list_product');
const loading = document.querySelector('.loading');
const footer_customer=document.querySelector('.footer_customer')



var number_product_per_loading=10;
var start=0;

  

    JSONarray =JSON.parse(JSONarray)


getPost();

window.addEventListener('scroll', (event) => {


    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight -2 && number_product_per_loading <JSONarray.length ) {
		// show the loading animation
		showLoading();
        start=number_product_per_loading;
        number_product_per_loading=number_product_per_loading + 10;
        
	}
  
 
});

function showLoading() {
	loading.classList.add('show');
	
	// load more data
	setTimeout(getPost, 1000)
}

function getPost() {
  
    for(let i=start;i<number_product_per_loading;i++)
    
    {
        if(JSONarray[i]){
            addDataToDOM(JSONarray[i]);
        }
        	
    }

}



function addDataToDOM(JSONarray) {
  
	const postElement = document.createElement('div');
    postElement.style.cssText="width: 18rem;"
	postElement.classList.add('card','product');
	postElement.innerHTML = `
    
    <img src="/public/images/${JSONarray.product_image}" class="card-img-top" alt="...">
    <div class="card-body text-center">
        <h5 class="card-title">${JSONarray.product_name}</h5>
        <p class="card-text" style="font-size:20px">${JSONarray.product_price}$</p>
        <a href="/product/?id=${JSONarray.product_id}&idCate=${JSONarray.product_category_id}" class="btn btn-primary">Detail</a>
    </div>
	`;
   
	container.appendChild(postElement);
	
	loading.classList.remove('show');
   
}


//----