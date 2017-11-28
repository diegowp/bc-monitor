var App = App || {};

(function(){

    App.main = {

        callAPI: function( call, url, async ){

            var http = new XMLHttpRequest(),
                response = "";

            http.onreadystatechange = function(){

                if( this.status === 200 && this.readyState === 4 )
                    response = this.responseText;

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

            self.browser.storage.sync.set({
                high: parse_real.high.toFixed(2),
                low: parse_real.low.toFixed(2)
            }, function(){});

            self.browser.storage.sync.get(function( items ){

                if( parseInt( valBR ) > parseInt( items.high ) ){

                    self.browser.notifications.create("bcm",{
                        "type": "basic",
                        "iconUrl": self.browser.extension.getURL( "dist/icons/btc-icon-48.svg" ),
                        "title": "BC Monitor - AO INFINITO E ALÉMM!!!",
                        "message": "Valor Atual: R$ " + valBR.toFixed(2)
                    });

                    self.browser.notifications.clear("bcm");

                    // Caso seja exibida a notificação e qual o valor atual em que a notificação foi exibida
                    self.browser.storage.sync.set({
                        show_notification: true,
                        current_value: valBR.toFixed(2)
                    }, function(){});

                }

                if(  parseInt( valBR ) <= parseInt( items.btc_value ) ){

                    if( !items.show_notification || parseInt( valBR ) < parseInt( items.current_value ) ){

                        self.browser.notifications.create("bcm",{
                            "type": "basic",
                            "iconUrl": self.browser.extension.getURL( "dist/icons/btc-icon-48.svg" ),
                            "title": "BC Monitor - O Preço baixou!!",
                            "message": "Bora comprar mais Bitocoins? \n Valor Atual: R$ " + valBR.toFixed(2)
                        });

                        self.browser.notifications.clear("bcm");

                        // Caso seja exibida a notificação e qual o valor atual em que a notificação foi exibida
                        self.browser.storage.sync.set({
                            show_notification: true,
                            current_value: valBR.toFixed(2)
                        }, function(){});

                    }

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

            if( call === "refresh" )
                self.browser.runtime.sendMessage( sendValues, function( response ){});

            self.browser.runtime.onMessage.addListener( function( request, sender, sendresponse ){

                if( request.message === "get" )
                    sendresponse( sendValues );

            });

        },
        
        cache: function(){
            
            this.browser = chrome || browser;
            
        },

        init: function(){

            var self = App.main;

            self.cache();

            self.browser.storage.sync.set({
                show_notification: false,
            }, function(){});

            self.callBC();
            self.sendToUser();

            setInterval(function(){
                self.sendToUser( "refresh" );
            },30000);

        }

    };

    document.addEventListener("DOMContentLoaded",  App.main.init );

})();