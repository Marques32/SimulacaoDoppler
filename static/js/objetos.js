metro=21,
metroOficial=0.368,
frentesOndas = {
      _frentes: [],
      comprimento: metro,
      ultimoInsere: 0,
      tempoInsere: 1000,
      raio0: 5,
      metroPorSegundo: (metro/60),
      quantidade: 25,
      contador: 0,

      insere: function(){
         this._frentes.push({
            x: 90,
            y: 350,
            raio: 5,
            inicioAngulo: 0,
            finalAngulo: Math.PI * 2
         });
      },

      atualiza: function(){
         if(this._frentes.length == 0){
           this.insere();
         }else{
            var tam = this._frentes.length;
            for (var i = 0; i < tam; i++) {
               this._frentes[i].raio+=this.metroPorSegundo;
            }
            if(this._frentes[tam-1].raio>=this.raio0+this.comprimento){
               this.insere();
            }
         }
      },

      desenha: function(){
         for (var i = 0; i < this._frentes.length; i++) {
            var frentes = this._frentes[i];
            contexto.beginPath();
            contexto.arc(frentes.x, frentes.y, frentes.raio, frentes.inicioAngulo, frentes.finalAngulo, true);
            contexto.stroke();
         }
      }
   },

   frentesOndasMov = {
      _frentes: [],
      comprimento: metro,
      ultimoInsere: 0,
      raio0: 5,
      metroPorSegundo: (metro/10),
      tempoInsere: 1000,
      quantidade: 25,
      contador: 0,
      acrescimo: 90,
      frequencia: 735,
      frequenciaPercebida: 735,
      comprimentoReal: 0.47,
      comprimentoPercebido: 0.47,
      velocidade: 343,

      insere: function(){
         this._frentes.push({
            x: veiculo.x+this.acrescimo,
            y: 350,
            raio: 5,
            inicioAngulo: 0,
            finalAngulo: Math.PI * 2
         });
      },

      atualiza: function(deslocamento){
         var tam = this._frentes.length;
         if(tam == 0){
           this.insere();
         }else{
            for (var i = 0; i < tam; i++) {
               this._frentes[i].raio+=this.metroPorSegundo;
            }
            if(this._frentes[tam-1].raio>=this.raio0+this.comprimento){
               this.insere();
            }
            if((this._frentes[0].x+this._frentes[0].raio)>=observador.x && somAudivel==false && somAtivo==true){
                ondaChegou();
            }
         }

         if(afastando){
            this.frequenciaPercebida = calculaFrequenciaPercebidaAfastando();
            this.comprimentoPercebido = calculaComprimentoPercebidoAfastando();
         }else{
            this.frequenciaPercebida = calculaFrequenciaPercebida();
            this.comprimentoPercebido = calculaComprimentoPercebidoAproximando();
         }

         if(tam>0 && veiculo.velocidade != 0 && afastando==false){
            if(this._frentes[tam-1].x>observador.x){
                if(somAtivo){
                    somDistanciando();
                }
                afastando=true;
            }
         }

         if(tam>0 && observador.velocidade != 0 && afastando==false){
            if(this._frentes[tam-1].x>observador.x){
                if(somAtivo){
                    somDistanciando();
                }
                afastando=true;
            }
         }

         if(tam>0 && somAtivo==true){
            if(afastando){
                sine.volume = calculaVolume();
            }else{
                sineWave.volume = calculaVolume();
            }
         }
      },

      desenha: function(){
         for (var i = 0; i < this._frentes.length; i++) {
            var frentes = this._frentes[i];
            contexto.beginPath();
            contexto.arc(frentes.x, frentes.y, frentes.raio, frentes.inicioAngulo, frentes.finalAngulo, true);
            contexto.strokeStyle = "black";
            contexto.stroke();
         }
         contexto.font = '20px serif';
         contexto.fillText("vₛ = "+this.velocidade+"m/s", 10, 440);
         contexto.fillText("fᵣ = "+this.frequencia+"Hz", 10, 470);
         contexto.fillText("λᵣ ="+this.comprimentoReal+"m", 10, 495);
         contexto.fillText("fₐ = "+this.frequenciaPercebida+"Hz", 300, 470);
         contexto.fillText("λₐ = "+this.comprimentoPercebido+"m", 300, 495);
      }
   },

   veiculo = {
      x: 0,
      y: 350,
      largura: 120,
      altura: 62,
      velocidade: 0,

      atualiza: function(){
         var deslocamento=((metro/60)*(parseInt(this.velocidade)));

         this.x -= (deslocamento/(10*5.7));

         frentesOndasMov.atualiza(deslocamento);

      },

      desenha: function(){
         contexto.drawImage(imagemVeiculo, this.x, this.y, this.largura, this.altura);
         if(ondaAtiva){
            frentesOndasMov.desenha();
         }
      }
   };

   observador = {
      x: 350,
      y: 380,
      largura: 30,
      altura: 50,
      velocidade: 0,

      atualiza: function(){
            var deslocamento=((metro/60)*(parseInt(this.velocidade)));
            this.x -= (deslocamento/(10*5.7));
      },

      desenha: function(){
         contexto.drawImage(imagemObservador, this.x, this.y, this.largura, this.altura);
      }
   };