var App = App || {};

(function(){

    App.options = {

        save: function(){

            document.querySelector("button").addEventListener("click", function(e){

                var value   = document.getElementById("btc-value").value,
                    status  = document.querySelector("div.status"),
                    self    = App.options;

                self.browser.storage.sync.set({
                    btc_value: value
                }, function(){
                    setTimeout(function(){
                        status.style.display = "block";
                        status.innerHTML = "Salvo com sucesso.";
                    }, 800);
                });

            });

        },

        load: function(){

            var value   = document.getElementById("btc-value"),
                self    = App.options;

            self.browser.storage.sync.get(function( items ){
                value.value = parseFloat( items.btc_value );
            });

        },
        
        cache: function(){

            this.browser = chrome || browser;
            
        },

        init: function(){

            var self = App.options;

            self.cache();
            self.load();
            self.save();

        }

    };

    document.addEventListener("DOMContentLoaded", App.options.init);

})();