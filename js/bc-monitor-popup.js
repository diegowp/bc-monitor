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

            var fillFields = function( values ){

                field_4.innerHTML = "<span class='list-title'>Alta R$</span> <br>" + values.valMax;
                field_1.innerHTML = "<span class='list-title'>Valor US</span> <br>" + values.valBTC;
                field_2.innerHTML = "<span class='list-title'>Compra R$</span> <br>" + values.valBR;
                field_3.innerHTML = "<span class='list-title'>Venda R$</span> <br>" + values.valSell;

            };

            setTimeout(function(){
                self.browser.runtime.sendMessage( {message: "get"}, function( response ){ fillFields( response ) });
            }, 300);

            setTimeout(function(){
                self.browser.runtime.onMessage.addListener( function( request, sender, sendresponse ){ fillFields( request ) })
            }, 300);

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
