var App = App || {};

(function(){

    App.main = {

        callAPI: function( call, url, async ){

            var http = new XMLHttpRequest(),
                response = "";

            http.onreadystatechange = function(){

                if( this.status === 200 && this.readyState === 4 ){
                    response = this.responseText;
                }else{
                    response = "Ops! Os Macacos do Laboratório ficaram loucos =O !!";
                    //document.querySelector(".bc-main-wrapper").innerHTML = response;
                }

            };

            http.open( call, url, async );
            http.send();

            return response;

        },

        callBC: function(){

            var self = App.main;

            var response_dolar  = self.callAPI( "GET", "https://api.coindesk.com/v1/bpi/currentprice.json", false ),
                response_real   = self.callAPI( "GET", "https://www.mercadobitcoin.net/api/BTC/ticker/", false ),
                parse_dolar     = JSON.parse( response_dolar ),
                parse_real      = JSON.parse( response_real );

            var convertToFloat = function( number ){
                return parseFloat( number ).toFixed(2);
            };

            self.browser.storage.sync.set({
                high: convertToFloat( parse_real.ticker.high ),
                low: convertToFloat( parse_real.ticker.low ),
                dolar: parse_dolar.bpi.USD.rate_float.toFixed(2),
                buy: convertToFloat( parse_real.ticker.buy ),
                sell: convertToFloat( parse_real.ticker.sell )
            }, function(){});

            self.browser.storage.sync.get(function( items ){

                if( parseInt( items.buy ) > parseInt( items.high ) ){

                    self.browser.notifications.create("bcm",{
                        "type": "basic",
                        "iconUrl": self.browser.extension.getURL( "dist/icons/btc-icon-48.svg" ),
                        "title": "BC Monitor - AO INFINITO E ALÉMM!!!",
                        "message": "Valor Atual: R$ " + items.buy
                    });

                    self.browser.notifications.clear("bcm");

                    // Caso seja exibida a notificação e qual o valor atual em que a notificação foi exibida
                    self.browser.storage.sync.set({
                        show_notification: true,
                        current_value: items.buy
                    }, function(){});

                }

                if(  parseInt( items.buy ) <= parseInt( items.btc_value ) ){

                    if( !items.show_notification || parseInt( items.buy ) < parseInt( items.current_value ) ){

                        self.browser.notifications.create("bcm",{
                            "type": "basic",
                            "iconUrl": self.browser.extension.getURL( "dist/icons/btc-icon-48.svg" ),
                            "title": "BC Monitor - O Preço baixou!!",
                            "message": "Bora comprar mais Bitocoins? \n Valor Atual: R$ " + items.buy
                        });

                        self.browser.notifications.clear("bcm");

                        // Caso seja exibida a notificação e qual o valor atual em que a notificação foi exibida
                        self.browser.storage.sync.set({
                            show_notification: true,
                            current_value: items.buy
                        }, function(){});

                    }

                }

            });

        },

        sendToUser: function( call ){

            var self = App.main;

            var sendValues = {};

            self.browser.storage.sync.get(function( items ){

                sendValues = {
                    valMax: items.high,
                    valBTC: items.dolar,
                    valBR: items.buy,
                    valSell: items.sell
                };

                if( call === "refresh" ){
                    self.browser.runtime.sendMessage( sendValues, function( response ){});
                }

            });

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
                self.callBC();
                self.sendToUser( "refresh" );
            },30000);

        }

    };

    document.addEventListener("DOMContentLoaded",  App.main.init );

})();