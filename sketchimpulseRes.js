
let sig1 = [];
let sig2 = [];
let noSamples_2 = 6*128;
alp = 1;
Ts = 1/128;
var ipplot = 1

function setup() {
    createCanvas(1200, 600)

    textFont('Georgia');
    textSize(30);
    text('Impulse Response Definition', width/2 - 200, 30);

    textFont('Georgia');
    textSize(16);
    text('Click over the plot to toggle between Input and Ouput', width/2 - 200, 480);

    c = createSlider(0, 2, 1, 1/128);
    c.position(500, 450);
    c.style('width', '200px');

    updateSignals()
    
    // plot1:1
    plot1 = new GPlot(this);
    plot1.setPos(40, 40);
    plot1.setOuterDim(1000, 400);
    plot1.addLayer("layer 1", sig1);

    plot1.setLineColor('red')
    plot1.setLineWidth(3)
    plot1.getLayer("layer 1").setLineColor('#1411ba');
    plot1.getLayer("layer 1").setLineWidth(3);

    plot1.getXAxis().setAxisLabelText("time (sec)");
    plot1.getYAxis().setAxisLabelText("Amplitude");
  
    updatePlot()
    c.input(updatewithNewinput)
  
}


function updatePlot()
{
  if(ipplot == 1)
  {
    plot1.setPoints(sig1);
    plot1.getLayer("layer 1").setPoints(sig2);
    plot1.setTitleText("Inputs: 1. Rect pulse, 2. Decay exponential");
  }
  else
  {
    plot1.setPoints(sigop1);
    plot1.getLayer("layer 1").setPoints(sigop2);
    plot1.setTitleText("Output");
  }
  defaultDraw(plot1);
}

function updateSignals()
{
  C = c.value()
  sig1 = []
  sig2 = []

  noSamples_1 = C/Ts;

  for (i = 0; i <=noSamples_1 ; i++ )
    sig1[i] = new GPoint(i*Ts, 1/C);
  
  for (i = noSamples_1 + 1; i <=noSamples_2 ; i++ )
    sig1[i] = new GPoint(i*Ts, 0);
  
  for (i = 0; i <=noSamples_2 ; i++ )
    sig2[i] = new GPoint(i*Ts, (1/C)*exp(-((i*Ts)/C)));
  
  
  sigop2 = []
  for (i = 0; i <=noSamples_2 ; i++ )
  {  
      x = (1/1- (alp*C))*(exp(-alp*i*Ts) - exp((-i*Ts)/C))
      sigop2[i] = new GPoint(i*Ts, x)
  }
  
  sigop1 = []
  for (i = 0; i <=noSamples_1 ; i++ )
  {  
      x = (1/(alp*C))*(1 - exp(-alp*i*Ts))
      sigop1[i] = new GPoint(i*Ts, x)
  }
  
  for (i = noSamples_1 + 1; i <=noSamples_2 ; i++ )
  {
      x = (1/(alp*C))*(exp(alp*C) - 1) *exp(-alp*i*Ts)
      sigop1[i] = new GPoint(i*Ts, x)
  }
  
  
  for (i = 0; i > -100 ; i-- )
  {
    x = new GPoint((i-1)*Ts, 0);
    sig1.unshift(x)
    sig2.unshift(x)
    sigop1.unshift(x)
    sigop2.unshift(x)
  }  

}


function draw()
{

}

function updatewithNewinput()
{
  updateSignals();
  updatePlot();
}

function defaultDraw(plotIP)
{
  if(ipplot)
  {
    plotIP.setYLim(0, 1/C); 
  }
  else
  {
    plotIP.setYLim(0, 1.2);
  }

  plotIP.beginDraw();
  plotIP.drawBackground();
  plotIP.drawBox();
  plotIP.drawXAxis();
  plotIP.drawYAxis();
  plotIP.drawTitle();
  // plotIP.drawGridLines(GPlot.BOTH);
  plotIP.drawGridLines(GPlot.BOTH);
  plotIP.drawLines();
  // plot2.drawPoints();
  plotIP.endDraw();
}


mouseClicked = function() 
{
  if(plot1.isOverBox(mouseX, mouseY))
  {
    ipplot = !ipplot;
    updatewithNewinput()
  }

}
