#pragma strict


// dépendances
private var slideshow  : slideShow ;
private var windows  : showingWindow ;
private var audioPlayer : sound ;
private var textViewer : text ;
private var strip : displayStrip;


// On est en mode plein écran ?
private var onFullScreen : boolean ;


// isolation de l'élément par rapport à la sphère complete
private var isolate : boolean = true ;
private var toMove : Vector3 = new Vector3( -2000, -2000, -2000) ;



// Position et rotation quand au début
private var VideoInitialPos : Vector3 ;
private var VideoInitialRot : Vector3 ;
private var CameraInitialPos : Vector3 ;
private var CameraInitialOrthographic : boolean ;








/*
 * Initialisation des variables
 */

function InitFullScreen( ) {
	
	slideshow =		gameObject.AddComponent("slideShow")		as slideShow ;
	windows =		gameObject.AddComponent("showingWindow")	as showingWindow ;
	audioPlayer =	gameObject.AddComponent("sound")			as sound ;
	textViewer =	gameObject.AddComponent("text")				as text ;
	strip = 		gameObject.AddComponent("displayStrip")		as displayStrip;
	
	onFullScreen = false ;
	

}

function OnGUIFullScreen(){
	
	if( onFullScreen ) {
	
		audioPlayer.OnGUISound();
		
		textViewer.OnGUIText();
	}

}



/*
 * Maj des éléments
 */


function UpDateFullScreen() {
	
	if( onFullScreen ) {
		
		slideshow.UpDateSlideShow();
		
		var temp = slideshow.getCurrentAssociedInfo() ;
		
		windows.SetNewTextureObj( temp );
		
	}
	
}







/*
 * Les CallBack des entrées et sorties
 */


function EnterOnFullScreen( Video : GameObject ) {
	
	// On retient les positions initiale pour pouvoir les restituer
	VideoInitialPos = Video.transform.position ;
	VideoInitialRot = Video.transform.eulerAngles ;
	CameraInitialPos = camera.transform.position ;
	CameraInitialOrthographic = camera.orthographic ;
	
	// On déplace le tout pour l'isoler ds autres éléments
	if( isolate ) {
		camera.transform.position += toMove ;
		//Video.transform.position += toMove ;
	}
	
	
	// Configuration de la camera et de la lumière
	camera.orthographic = true ;
	gameObject.light.type = LightType.Directional ;
	gameObject.light.intensity = 0.4 ;
	
	
	onFullScreen = true ;
	
	
	var margin : Vector2 = new Vector2(	0, 0.04 );
	
	
	var Datas : scriptForPlane = Video.GetComponent('scriptForPlane');
	
	
	
	var slideShowImgs : Array = Datas.getImages();
	var slideShowMin : Array = Datas.getMiniatures();
	var slideShowElmt : SLIDESHOWELMT ;
	
	
	slideshow.InitSlideShowFactor(slideShowImgs.length, Rect( 0.55 + margin.x , 0.1 + margin.y , 0.4 - 2*margin.x , 0.18 - 2*margin.y), 20);
	windows.InitWindowFactor( Rect( 0.55 + margin.x , 0.1 + margin.y , 0.4 - 2*margin.x , 0.64 - 2*margin.y), 20 );
	
	
	for (var i = 0; i < slideShowImgs.length; i++ ) {
		slideShowElmt = new SLIDESHOWELMT(		slideShowImgs[i],
												WINDOWTYPES.IMG,
												Vector2(260, 390) 	) ;
		
		slideshow.AddElmt(		fileSystem.getAssociatedMin( slideShowImgs[i], slideShowMin ),
								slideShowElmt 									);
	}
	
	
	textViewer.placeText(Screen.height/10, Screen.height * 0.26, Screen.width/20, Screen.width * 0.55, ""/*Datas.getText() */); // u d l r (margins) + Text to display
	
	audioPlayer.placeMusic (Screen.height * 0.74 + 10, Screen.height/10, Screen.width/20, Screen.width * 0.45, Datas.getSounds() ); // Coordinates of the music layout. U D L R. The button is always a square
	

	// create plane
	strip.InitVideoScreen();

	
	Datas.getVideos();

	
}

function LeaveFullScreen( Video : GameObject ) {
	
	// Restitution des positions
	Video.transform.position = VideoInitialPos ;
	Video.transform.eulerAngles = VideoInitialRot;
	camera.transform.position = CameraInitialPos ;
	camera.orthographic = CameraInitialOrthographic ;
	
	audioPlayer.removeMusic();
	textViewer.removeText();
	
	slideshow.destuctSlideShow();
	windows.destuctWindow();
	
	onFullScreen = false ;
}



