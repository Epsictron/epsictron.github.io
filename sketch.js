  let j = 0;
  let Ts = 1/64;
  let f1 = 1
  let sig1 = [];
  let sig2 = [];
  let sig3 = [];

  let sig1_fft_mag = [];
  let sig2_fft_mag = [];
  let sig3_fft_mag = [];
  let crossterms = []
  let noDFT = 1024;
  let noPoints = 150;
  let freqres= (1/noDFT)*(1/Ts);
  var radio; 

function setup() {
    createCanvas(1300, 1000);  
    textSize(32);
    text('word', 10, 30);

    radio = createRadio(); 
    radio.option('Rectangular Window');   
    radio.option('Hamming Winodw');
    radio.style("width", "500px");    
    radio.position(800, 10); 
    radio.value('Rectangular Window'); 

    slider_A = createSlider(0, 1, 1, 0.0005);
    slider_A.position(10 + 50, 10);
    slider_A.style('width', '200px');

    slider_f = createSlider(0, 4, 1, 0.0005);
    slider_f.position(250 + 50, 10);
    slider_f.style('width', '200px');

    slider_T = createSlider(0, (1/Ts)*2, 1/Ts, 1);
    slider_T.position(500 + 50, 10);
    slider_T.style('width', '200px');

    updateSignals()

    // plot1:1
    plot1 = new GPlot(this);
    plot1.setPos(0, 0);
    plot1.setOuterDim(1200, 400);
    plot1.setBoxBgColor ('black');

    // plot2:1
    plot2 = new GPlot(this);
    plot2.setPos(0, 400);
    plot2.setOuterDim(1200, 500);
    plot2.setBoxBgColor ('black');

    // Add the points
    plot1.setPoints(sig3);
    plot1.addLayer("layer 1", sig1);
    plot1.addLayer("layer 2", sig2);
    plot1.setLineColor('red')
    plot1.setLineWidth(4)
    plot1.getLayer("layer 1").setLineColor('#fae');
    plot1.getLayer("layer 1").setLineWidth(3);
    plot1.getLayer("layer 2").setLineColor('#9faad1');
    plot1.getLayer("layer 2").setLineWidth(3);
    
    // Set the plot1 title and the axis labels
    plot1.setTitleText("A very simple example");
    plot1.getXAxis().setAxisLabelText("x axis");
    plot1.getYAxis().setAxisLabelText("y axis");
    // plot1.getXAxis().setNTicks(20);
    plot1.getXAxis().setTicksSeparation (0.1) 
    plot1.setFontName('Georgia')
    plot1.setYLim(-2, 2);

    // Add the points
    plot2.setPoints(sig3_fft_mag);
    plot2.addLayer("layer 1", sig2_fft_mag);
    plot2.addLayer("layer 2", sig1_fft_mag);
  
    plot2.setLineColor('red')
    plot2.setLineWidth(4)
    plot2.getLayer("layer 1").setLineColor('#fae');
    plot2.getLayer("layer 1").setLineWidth(2);
    plot2.getLayer("layer 2").setLineColor('#9faad1');
    plot2.getLayer("layer 2").setLineWidth(2);    
  
    // Set the plot2 title and the axis labels
    plot2.setTitleText("A very simple example");
    plot2.getXAxis().setAxisLabelText("x axis");
    plot2.getYAxis().setAxisLabelText("y axis");
    plot2.getXAxis().setTicksSeparation (1) 
    plot2.getYAxis().setTicksSeparation (10) 
    plot2.setYLim(-30, 45);

    updatePlot()
    
    slider_A.input(updatewithNewinput)
    slider_f.input(updatewithNewinput)
    slider_T.input(updatewithNewinput)
    radio.input(updatewithNewinput)

    frameRate(20);
}

function dft(x) {
  const X = [];
  const N = x.length;
  // for (let k = 0; k < N/2 + 1; k++) 
  for (let k = 0; k < noPoints; k++) 
  {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (TWO_PI * k * n) / N;
      re += x[n] * cos(phi);
      im -= x[n] * sin(phi);
    } 
    let freq = k;
    let amp = sqrt(re * re + im * im);
    let phase = atan2(im, re);
    X[k] = { re, im, freq, amp, phase };
  }
  return X;
}

function getEnergy(x)
{
  let Energy = 0;
  const N = x.length;
  
  for( i = 0; i< N; i++)
    Energy = Energy +  x[i]*x[i];
  
  return Energy;
}

function winfunc(len)
{
  // Hamming window
  for (i = 0; i< len; i++)
      win[i] = 0.54 - 0.46*cos((2*PI*i)/len);

  return win
}

function updatePlot(){

  plot1.setPoints(sig3);
  plot1.getLayer("layer 1").setPoints(sig1);
  plot1.getLayer("layer 2").setPoints(sig2);

  defaultDraw(plot1)

  plot2.setPoints(sig3_fft_mag);
  plot2.getLayer("layer 1").setPoints(sig2_fft_mag);
  plot2.getLayer("layer 2").setPoints(sig1_fft_mag);
  
  defaultDraw(plot2)
 
}

function updateSignals()
{
  A2        = slider_A.value()
  f2        = slider_f.value()
  NoSamples = slider_T.value()
  
  win = []
  win  = winfunc(NoSamples);
  
  y1 = [];
  y2 = [];
  y3 = [];

  sig1 = [];
  sig2 = [];
  sig3 = [];

  sig1_fft_mag = [];
  sig2_fft_mag = [];
  sig3_fft_mag = [];
  crossterms = [];

  winName = radio.value();
  for (i = 0; i < NoSamples; i++) 
  {
    x1 = cos(2*PI*f1*i*Ts);
    x2 = A2*cos(2*PI*f2*i*Ts);
    x3 = x1+x2;
    
    if (winName == "Rectangular Window")
    {
      y1[i]  = x1;
      y2[i]  = x2;
      y3[i]  = x3;
    }
    else
    {
      y1[i]  = x1*win[i];
      y2[i]  = x2*win[i];
      y3[i]  = x3*win[i];
    }
  
    sig1[i] = new GPoint(i*Ts, y1[i]);
    sig2[i] = new GPoint(i*Ts, y2[i]);
    sig3[i] = new GPoint(i*Ts, y3[i]);
  }

  k = y1.length;
  for ( j = 0; j < noDFT - k; j++ )
  {
    y1.push(0); y2.push(0); y3.push(0);
  }

  sig1_fft = dft(y1);
  sig2_fft = dft(y2);
  sig3_fft = dft(y3);

  // for (i = 0; i< sig1_fft.length; i++)
  for (i = 0; i< noPoints; i++)
  {    
    sig1_fft_mag[i] = new GPoint(i*freqres, 0.4342 * 20*log(sig1_fft[i].amp))
    sig2_fft_mag[i] = new GPoint(i*freqres, 0.4342 * 20*log(sig2_fft[i].amp))
    sig3_fft_mag[i] = new GPoint(i*freqres, 0.4342 * 20*log(sig3_fft[i].amp))
    // sig1_fft_mag[i] = new GPoint(i*freqres, (sig1_fft[i].amp))
    // sig2_fft_mag[i] = new GPoint(i*freqres, (sig2_fft[i].amp))
    // sig3_fft_mag[i] = new GPoint(i*freqres, (sig3_fft[i].amp))
    crossterms[i]   = new GPoint(i*freqres, 2*((sig1_fft[i].re * sig2_fft[i].re) + (sig1_fft[i].im * sig2_fft[i].im))) 
  }


}


function draw()
{
//  background(220);
}

function updatewithNewinput()
{
  updateSignals();
  updatePlot();
}

function defaultDraw(plotIP)
{
  plotIP.beginDraw();
  plotIP.drawBackground();
  plotIP.drawBox();
  plotIP.drawXAxis();
  plotIP.drawYAxis();
  plotIP.drawTitle();
  plotIP.drawGridLines(GPlot.BOTH);
  plotIP.drawLines();
  // plot2.drawPoints();
  plotIP.endDraw();

}