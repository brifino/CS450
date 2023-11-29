
// make this 120 for the mac:
#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;		// coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;				// object color
uniform vec3    uSpecularColor;		// light color
uniform float   uShininess;			// specular exponent

// ellipse-equation uniform variables -- these should be set every time Display( ) is called:

uniform float	uSc, uTc;	// Ellipse center
uniform float	uRs, uRt;	// Elipse radii

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates

uniform	float	red;
uniform	float	green;
uniform	float	blue;


void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);
	float s = vST.s;
	float t = vST.t;

	float sRadius = pow((s - uSc) / uRs, 2);
	float tRadius = pow((t - uTc) / uRt, 2);

	// determine the color using the elipse-boundary equations:

	vec3 myColor = uColor;
	if( (sRadius + tRadius) <= 1.f)
	{
		myColor = vec3( red, green, blue );;
	}

	// apply the per-fragmewnt lighting to myColor:

	vec3 ambient = uKa * myColor;

	float dd = max( dot(Normal,Light), 0. );		// only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * myColor;

	float ss = 0.;
	if( dot(Normal,Light) > 0. )					// only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}

