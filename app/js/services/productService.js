'use strict';
four51.app.factory('ProductService', function($resource, $451){
    var productAPI = $resource(Global.api('product/:interopID'), {interopID: '@ID'}, {'search': {method: 'POST', isArray:true}});
    console.log('cached declared');
    function cacheProduct(product){
        $451.setLocal("product-" + product.InteropID, product, true)
    }
    function getCachedProduct(interopID){
        return $451.getLocal("product-" + interopID, true)
    }
    return {
        search: function(categoryInteropID, searchTerm){
            console.log('calling product search: category:' + categoryInteropID + ' search: ' + searchTerm)
            return productAPI.search({'CategoryInteropID': categoryInteropID, 'SearchTerms': searchTerm}, function(data){
                for(var i = 0; i < data.length; i++){
                    if(!getCachedProduct(data[i].InteropID)){
                        cacheProduct(data[i]);
                    }
                }
                return data;
            });
        },
        getOne: function(interopID){

            var cached = getCachedProduct(interopID);
            if(!cached){
                return productAPI.get({interopID: interopID}, function(data){
                    console.log('putting prodcut to the cache')
                    cacheProduct(data);
                });
            }
            else{
                console.log('returning cached product')
                return cached;
            }

        }
    }
});