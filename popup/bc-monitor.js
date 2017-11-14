var App = App || {};

(function(){

    App.popup = {

        cache: function(){

            this.bc_val = document.getElementById("bc-val");
            this.bc_buy = document.getElementById("bc-buy-val");
            this.bc_sell = document.getElementById("bc-sell-val");

        },

        callValues: function() {

            var field_1 = this.bc_val;
            var field_2 = this.bc_buy;
            var field_3 = this.bc_sell;

            chrome.runtime.sendMessage( {message: "get"}, function( response ){

                /*
                @Response({
                    valBTC: valBTC,
                    valBR: valBR,
                    val_btc_br: val_btc_br
                });
                */

                field_1.innerHTML = "Valor em Dólar  = USD " + response.valBTC;
                field_2.innerHTML = "Valor de compra =  R$ " + response.valBR;
                field_3.innerHTML = "Valor de venda  =  R$ " + response.val_btc_br;

            });

        },

        init: function(){

            var self = App.popup;

            self.cache();
            self.callValues();

        }

    };

    document.addEventListener("DOMContentLoaded", App.popup.init );

})();
