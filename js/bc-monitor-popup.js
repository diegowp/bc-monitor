var App = App || {};

(function(){

    App.popup = {

        cache: function(){

            this.browser = chrome || browser;
            this.bc_val = document.getElementById("bc-val");
            this.bc_buy = document.getElementById("bc-buy-val");
            this.bc_sell = document.getElementById("bc-sell-val");
            this.bc_max = document.getElementById("bc-max");

        },

        callValues: function() {

            var field_1 = this.bc_val,
                field_2 = this.bc_buy,
                field_3 = this.bc_sell,
                field_4 = this.bc_max,
                self    = App.popup;

            var fillFields = function( values, type ){

                var valMax, valBTC, valBR, valSell;

                if( type === "get" ){
                    valMax  = values.valMax;
                    valBTC  = values.valBTC;
                    valBR   = values.valBR;
                    valSell = values.valSell;
                }else if( type === "new" ){
                    valMax  = values.high;
                    valBTC  = values.dolar;
                    valBR   = values.buy;
                    valSell = values.sell;
                }
                field_4.innerHTML = "<span class='list-title'>Alta R$</span> <br>" + valMax;
                field_1.innerHTML = "<span class='list-title'>Valor US</span> <br>" + valBTC;
                field_2.innerHTML = "<span class='list-title'>Compra R$</span> <br>" + valBR;
                field_3.innerHTML = "<span class='list-title'>Venda R$</span> <br>" + valSell;

            };

            self.browser.runtime.sendMessage( {message: "get"}, function( response ){ fillFields( response, "get" ) });

            self.browser.runtime.onMessage.addListener( function( request, sender, sendresponse ){ fillFields( request, "get" ); })

            setTimeout(function(){ self.browser.storage.sync.get( function( values ){ fillFields( values, "new" ) } ) }, 300);

        },

        generics: function(){

            var linkOptions = document.querySelector("a#options"),
                self        = App.popup;

            linkOptions.onclick = function(){

                self.browser.tabs.update( {url: "chrome://extensions/?options=" + self.browser.app.getDetails().id} );

            };

        },

        init: function(){

            var self = App.popup;

            self.cache();
            self.callValues();
            self.generics();

        }

    };

    document.addEventListener("DOMContentLoaded", App.popup.init );

})();
