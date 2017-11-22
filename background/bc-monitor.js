var App = App || {};

(function(){

    App.main = {

        callAPI: function( call, url, async ){

            var http = new XMLHttpRequest(),
                response = "";

            http.onreadystatechange = function(){

                if( this.status === 200 && this.readyState === 4 ){
                    response = this.responseText;
                }

                if( this.status === 400 || this.status === 404 || this.status === 500 || this.status === 503 || this.status === 520 ){
                    response = "Ops! Os Macacos do Laboratório ficaram loucos =O !!";
                    document.querySelector(".bc-main-wrapper").innerHTML = response;
                    return false;
                }

            };

            http.open( call, url, async );
            http.send();

            return response;

        },

        callBC: function(){

            var self = App.main;

            var response_dolar  = self.callAPI( "GET", "https://api.coindesk.com/v1/bpi/currentprice.json?nocache=true", false ),
                response_real   = self.callAPI( "GET", "https://api.blinktrade.com/api/v1/BRL/ticker?crypto_currency=BTC&nocache=true", false ),

                parse_dolar     = JSON.parse( response_dolar ),
                parse_real      = JSON.parse( response_real ),

                valBTC          = parse_dolar.bpi.USD.rate_float,
                valBR           = parse_real.buy,
                val_btc_br      = parse_real.sell;

            // console.log( "Valor Bitcoin ( USS ) = " + valBTC.toFixed(2) );
            // console.log( "Valor de Compra ( R$ ) = " + valBR.toFixed(2) );
            // console.log( "Valor de Venda ( R$ ) = " + val_btc_br.toFixed(2) );

            chrome.storage.sync.get(function( items ){

                if(  parseInt( valBR ) <= parseInt( items.btc_value ) ){

                    chrome.notifications.create("bcm",{
                        "type": "basic",
                        "iconUrl": "chrome-extension://jdddepmigkoahgpnpnmgghambfbeifga/icons/btc-icon-48.svg",
                        "title": "BC Monitor - O Preço baixou!!",
                        "message": "Bora comprar mais Bitocoins? \n Valor Atual: R$ " + valBR.toFixed(2)
                    });

                    chrome.notifications.clear("bcm");

                }

            });

            var send_to_popup = [];
            send_to_popup["valBTC"]      = valBTC.toFixed(2);
            send_to_popup["valBR"]       = valBR.toFixed(2);
            send_to_popup["val_btc_br"]  = val_btc_br.toFixed(2);

            return send_to_popup;

        },

        sendToUser: function( call ){

            var self = App.main;

            var get_values = self.callBC(),
                sendValues = {
                    valBTC: get_values["valBTC"],
                    valBR: get_values["valBR"],
                    val_btc_br: get_values["val_btc_br"]
                };

            if( call === "refresh" ){

                chrome.runtime.sendMessage( sendValues, function( response ){});

            }

            chrome.runtime.onMessage.addListener( function( request, sender, sendresponse ){

                if( request.message === "get" ){

                    sendresponse( sendValues );

                }

            });

        },

        init: function(){

            var self = App.main;

            self.callBC();
            self.sendToUser();

            setInterval(function(){
                self.sendToUser( "refresh" );
            },30000);

        }

    };

    document.addEventListener("DOMContentLoaded",  App.main.init );

})();