var App = App || {};

(function(){

    App.options = {

        save: function(){

            document.querySelector("button").addEventListener("click", function(e){

                var value = document.getElementById("btc-value").value,
                    status = document.querySelector("div.status");

                chrome.storage.sync.set({
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

            var value = document.getElementById("btc-value");

            chrome.storage.sync.get(function( items ){
                value.value = parseFloat( items.btc_value );
            });

        },

        init: function(){

            var self = App.options;

            self.load();
            self.save();

        }

    };

    document.addEventListener("DOMContentLoaded", App.options.init);

})();