var canvas, contexto, altura, largura, frames = 0, fundo, imagemVeiculo, somAtivo=false, ondaAtiva=false, afastando=false, reguaAtiva=false, somAudivel=false;

function clique(){

}

function main(){

   canvas = document.getElementById("simulacao");
   largura = window.innerWidth;
   canvas.width = 500;

   if(largura<500){
    canvas.width = largura-30;
    observador.x = canvas.width-100;
   }

   canvas.height = 500;
   canvas.style.border = "1px solid #000";

   contexto = canvas.getContext("2d");

   //document.addEventListener("mousedown", clique);
    colocaImagemFundo();
    colocaImagemVeiculoDireita();
    colocaImagemObservadorEsquerda();

    fundo.onload = function(){
        contexto.drawImage(fundo, 0, 0, canvas.width,canvas.height);

        observador.desenha();
        veiculo.desenha();

   };

   //tempoInicial = new Date().getTime();

   velocidadeFonte = document.getElementById('velocidadeFonte');
   //saidaFonte = document.getElementById('saidaFonte');
   velocidadeFonte.addEventListener('change',function(){

      veiculo.velocidade = parseInt(velocidadeFonte.value)*5;
   });

   velocidadeObservador = document.getElementById('velocidadeObservador');
   velocidadeObservador.addEventListener('change',function(){
       observador.velocidade = parseInt(velocidadeObservador.value)*5;
   });

    velocidadeFonte.readOnly=true;
    velocidadeObservador.readOnly=true;


   btnInicia = document.getElementById('inicia');
   btnPausa = document.getElementById('pausa');
   btnReinicia = document.getElementById('reinicia');
   escolheCaso = document.getElementById('escolheCaso');
   //tempoAtualizado = new Date().getTime();
   /*$('#inicia').click(function(){
        alert('foi!');
   });*/

   btnInicia.addEventListener('click', inicia);
   btnPausa.addEventListener('click', pausa);
   btnReinicia.addEventListener('click', reinicia);
   escolheCaso.addEventListener('change',function(){
        contexto.clearRect(0,0,canvas.width,canvas.height);

        var valor = parseInt(escolheCaso.options[escolheCaso.selectedIndex].value);

        switch(valor){
            case 1:
                colocaImagemFundo();
                colocaImagemVeiculoDireita();
                colocaImagemObservadorEsquerda();
            break;
            case 2:
                colocaImagemFundo();
                colocaImagemVeiculoDireita();
                colocaImagemObservadorEsquerda();
                velocidadeObservador.readOnly = false;
                velocidadeFonte.readOnly = true;
            break;
            case 3:
                colocaImagemFundo();
                colocaImagemVeiculoDireita();
                colocaImagemObservadorDireita();
                velocidadeObservador.readOnly = false;
                velocidadeFonte.readOnly = true;
                afastando = true;
            break;
            case 4:
                colocaImagemFundo();
                colocaImagemVeiculoDireita();
                colocaImagemObservadorEsquerda();
                velocidadeObservador.readOnly = true;
                velocidadeFonte.readOnly = false;
            break;
            case 5:
                colocaImagemFundo();
                colocaImagemVeiculoEsquerda();
                veiculo.x=200;
                frentesOndasMov.acrescimo = 30;
                colocaImagemObservadorEsquerda();
                velocidadeObservador.readOnly = true;
                velocidadeFonte.readOnly = false;
                afastando = true;
            break;
            case 6:
                colocaImagemFundo();
                colocaImagemVeiculoDireita();
                colocaImagemObservadorEsquerda();
                velocidadeObservador.readOnly = false;
                velocidadeFonte.readOnly = false;
            break;
            case 7:
                colocaImagemFundo();
                colocaImagemVeiculoEsquerda();
                veiculo.x=200;
                frentesOndasMov.acrescimo = 30;
                colocaImagemObservadorDireita();
                velocidadeObservador.readOnly = false;
                velocidadeFonte.readOnly = false;
                afastando = true;
            break;
        }

        fundo.onload = function(){
            contexto.drawImage(fundo, 0, 0, canvas.width,canvas.height);

            imagemObservador.onload = function(){
                observador.desenha();
            }
            imagemVeiculo.onload = function(){
                veiculo.desenha();
            }
        };
   });
}

function inicia(){
    roda();
    carregaSom();
    velocidadeFonte.readOnly=true;
    velocidadeObservador.readOnly=true;
    btnInicia.removeEventListener('click', inicia);
}
function roda(){
    ondaAtiva=true;
    reguaAtiva=false;
    escolheCaso.disabled = true;
    //imagemRegua.style.display = "none";

   atualiza();
   desenha();

   idAnimation = window.requestAnimationFrame(roda);
}

function reinicia(){
    somAtivo=false;
    ondaAtiva=false;
    document.location.reload(true);
}

function pausa(){
   window.cancelAnimationFrame(idAnimation);
   somAtivo=false;
   ondaAtiva=false;
   btnInicia.addEventListener('click', inicia);
}

function atualiza(){
   frames++;
      veiculo.atualiza();
      observador.atualiza();
}

function desenha(){
   contexto.drawImage(fundo, 0, 0, 500, 500);

   veiculo.desenha();
   observador.desenha();
}

main();

function carregaSom(){
    somPro = 'base.mp3';
    som = 'base.mp3';

    if(veiculo.velocidade != 0 && observador.velocidade != 0){
        ambosMovimento();
    }else if(veiculo.velocidade != 0){
        fonteMovimento();
    }else if(observador.velocidade != 0){
        observadorMovimento();
    }


    sineWave = new Pizzicato.Sound({
        source: 'file',
        options: { path: 'media/audios/'+somPro, loop: true}
    }, function(){
	    sineWave.volume=calculaVolume();
	});

	sine = new Pizzicato.Sound({
        source: 'file',
        options: { path: 'media/audios/'+som, loop: true}
    });
    sine.volume=1;
}

function liga(){
    somAtivo=true;
}
function observadorMovimento(){
    var mov = 'observador';
    var vel = parseInt(velocidadeObservador.value);
    if(vel >=10){
        somPro = mov+'/aproximando/base-10.mp3';
        som = mov+'/distanciando/base-10.mp3';
    }else if(vel >=5){
        somPro = mov+'/aproximando/base-5.mp3';
        som = mov+'/distanciando/base-5.mp3';
    }
}

function fonteMovimento(){
    var mov = 'fonte';
    var vel = parseInt(velocidadeFonte.value);
    if(vel >=60){
        somPro = mov+'/aproximando/base-60.mp3';
        som = mov+'/distanciando/base-60.mp3';
    }else if(vel >=50){
        somPro = mov+'/aproximando/base-50.mp3';
        som = mov+'/distanciando/base-50.mp3';
    }else if(vel >=40){
        somPro = mov+'/aproximando/base-40.mp3';
        som = mov+'/distanciando/base-40.mp3';
    }else if(vel >=30){
        somPro = mov+'/aproximando/base-30.mp3';
        som = mov+'/distanciando/base-30.mp3';
    }else if(vel >=20){
        somPro = mov+'/aproximando/base-20.mp3';
        som = mov+'/distanciando/base-20.mp3';
    }else if(vel >=10){
        somPro = mov+'/aproximando/base-10.mp3';
        som = mov+'/distanciando/base-10.mp3';
    }
}

function ambosMovimento(){
    var mov = 'ambos';
    var velFont = parseInt(velocidadeFonte.value);
    var velObs = parseInt(velocidadeObservador.value);

    if(velFont >=50){
        if(velObs >=10){
            somPro = mov+'/aproximando/observador-10/base-50.mp3';
            som = mov+'/distanciando/observador-10/base-50.mp3';
        }else if(velObs >=5){
            somPro = mov+'/aproximando/observador-5/base-50.mp3';
            som = mov+'/distanciando/observador-5/base-50.mp3';
        }
    }else if(velFont >=40){
        if(velObs >=10){
            somPro = mov+'/aproximando/observador-10/base-40.mp3';
            som = mov+'/distanciando/observador-10/base-40.mp3';
        }else if(velObs >=5){
            somPro = mov+'/aproximando/observador-5/base-40.mp3';
            som = mov+'/distanciando/observador-5/base-40.mp3';
        }
    }else if(velFont >=30){
        if(velObs >=10){
            somPro = mov+'/aproximando/observador-10/base-30.mp3';
            som = mov+'/distanciando/observador-10/base-30.mp3';
        }else if(velObs >=5){
            somPro = mov+'/aproximando/observador-5/base-30.mp3';
            som = mov+'/distanciando/observador-5/base-30.mp3';
        }
    }else if(velFont >=20){
        if(velObs >=10){
            somPro = mov+'/aproximando/observador-10/base-20.mp3';
            som = mov+'/distanciando/observador-10/base-20.mp3';
        }else if(velObs >=5){
            somPro = mov+'/aproximando/observador-5/base-20.mp3';
            som = mov+'/distanciando/observador-5/base-20.mp3';
        }
    }else if(velFont >=10){
        if(velObs >=10){
            somPro = mov+'/aproximando/observador-10/base-10.mp3';
            som = mov+'/distanciando/observador-10/base-10.mp3';
        }else if(velObs >=5){
            somPro = mov+'/aproximando/observador-5/base-10.mp3';
            som = mov+'/distanciando/observador-5/base-10.mp3';
        }
    }
}

function ondaChegou(){
    sineWave.play(0,0);

    somAudivel = true;
}

function somDistanciando(){
    sineWave.stop();
    sine.play(0,0);
}

function desliga(){
    sineWave.stop();
    sine.stop();
}

function calculaComprimentoPercebidoAproximando(){
    var velocidadeSom = frentesOndasMov.velocidade;
    var comprimentoPercebido = frentesOndasMov.comprimentoReal;
    if(veiculo.velocidade != 0 && observador.velocidade != 0){

    }else if(veiculo.velocidade != 0){
        comprimentoPercebido = (velocidadeSom+parseInt(velocidadeFonte.value))/frentesOndasMov.frequencia;
    }else if(observador.velocidade != 0){
        //permanece o mesmo comprimento
    }

    return comprimentoPercebido.toFixed(2);
}

function calculaComprimentoPercebidoAfastando(){
    var velocidadeSom = frentesOndasMov.velocidade;
    var comprimentoPercebido = frentesOndasMov.comprimentoReal;
    if(veiculo.velocidade != 0 && observador.velocidade != 0){

    }else if(veiculo.velocidade != 0){
        comprimentoPercebido = (velocidadeSom-parseInt(velocidadeFonte.value))/frentesOndasMov.frequencia;
    }else if(observador.velocidade != 0){
        //permanece o mesmo comprimento
    }

    return comprimentoPercebido.toFixed(2);
}

function calculaFrequenciaPercebida(){
    var velocidadeSom = 343;
    var frequenciaPercebida = frentesOndasMov.frequencia;
    if(veiculo.velocidade != 0 && observador.velocidade != 0){
        frequenciaPercebida = ((velocidadeSom+parseInt(velocidadeObservador.value))/(velocidadeSom+parseInt(velocidadeFonte.value)))*frentesOndasMov.frequencia;
    }else if(veiculo.velocidade != 0){
        frequenciaPercebida = (velocidadeSom/(velocidadeSom+parseInt(velocidadeFonte.value)))*frentesOndasMov.frequencia;
    }else if(observador.velocidade != 0){
        frequenciaPercebida = ((velocidadeSom+parseInt(velocidadeObservador.value))/velocidadeSom)*frentesOndasMov.frequencia;
    }

    return frequenciaPercebida.toFixed(2);
}

function calculaFrequenciaPercebidaAfastando(){
    var velocidadeSom = 343;
    var frequenciaPercebida = frentesOndasMov.frequencia;
    if(veiculo.velocidade != 0 && observador.velocidade != 0){
        frequenciaPercebida = ((velocidadeSom-parseInt(velocidadeObservador.value))/(velocidadeSom-parseInt(velocidadeFonte.value)))*frentesOndasMov.frequencia;
    }else if(veiculo.velocidade != 0){
        frequenciaPercebida = (velocidadeSom/(velocidadeSom-parseInt(velocidadeFonte.value)))*frentesOndasMov.frequencia;
    }else if(observador.velocidade != 0){
        frequenciaPercebida = ((velocidadeSom-parseInt(velocidadeObservador.value))/velocidadeSom)*frentesOndasMov.frequencia;
    }

    return frequenciaPercebida.toFixed(2);
}

function calculaVolume(){
    var intesidadeMaxima = 1.59;
    var distanciaObservador = (Math.abs(observador.x-(veiculo.x+frentesOndasMov.acrescimo)))/metroOficial;
    var intensidadeInicial = 20/(4*3.14*(distanciaObservador+1)**2);
    var volumePorcetagem = intensidadeInicial/intesidadeMaxima;
    var volumeAjustado = volumePorcetagem*2000;

    return volumeAjustado;
}

function colocaImagemFundo(){
   fundo = new Image(canvas.width,canvas.height);
   fundo.src = "media/fotos/cena-nova.svg";
}

function colocaImagemVeiculoDireita(){
   imagemVeiculo = new Image(veiculo.largura,veiculo.altura);
   imagemVeiculo.src = "media/fotos/ambulancia-direita.svg";
}

function colocaImagemVeiculoEsquerda(){
   imagemVeiculo = new Image(veiculo.largura,veiculo.altura);
   imagemVeiculo.src = "media/fotos/ambulancia-esquerda.svg";
}

function colocaImagemObservadorDireita(){
   imagemObservador = new Image(observador.largura,observador.altura);
   imagemObservador.src = "media/fotos/observador-direita.svg";
}

function colocaImagemObservadorEsquerda(){
   imagemObservador = new Image(observador.largura,observador.altura);
   imagemObservador.src = "media/fotos/observador-esquerda.svg";
}