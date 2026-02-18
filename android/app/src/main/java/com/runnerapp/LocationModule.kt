package com.runnerapp
import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Looper
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.*
import com.google.android.gms.tasks.Task
class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var fusedLocationClient: FusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(reactContext)
    private var locationCallback: LocationCallback? = null
    private val TAG = "LocationModule"

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        // Check permissions
        if (ActivityCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject("PERMISSION_DENIED", "Location permission not granted")
            return
        }

        try {
            // Get last known location first (faster)
            fusedLocationClient.lastLocation.addOnSuccessListener { location: Location? ->
                if (location != null) {
                    val locationMap = Arguments.createMap().apply {
                        putDouble("latitude", location.latitude)
                        putDouble("longitude", location.longitude)
                        putDouble("accuracy", location.accuracy.toDouble())
                        putDouble("altitude", location.altitude)
                        putDouble("speed", location.speed.toDouble())
                        putDouble("heading", location.bearing.toDouble())
                        putDouble("timestamp", location.time.toDouble())
                    }
                    promise.resolve(locationMap)
                } else {
                    // If no last location, request fresh location
                    requestFreshLocation(promise)
                }
            }.addOnFailureListener { exception ->
                promise.reject("LOCATION_ERROR", exception.message)
            }
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", e.message)
        }
    }

    private fun requestFreshLocation(promise: Promise) {
        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            10000 // 10 seconds interval
        ).apply {
            setMinUpdateIntervalMillis(5000) // 5 seconds fastest update
            setWaitForAccurateLocation(true)
        }.build()

        val singleLocationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                super.onLocationResult(locationResult)
                val location = locationResult.lastLocation
                if (location != null) {
                    val locationMap = Arguments.createMap().apply {
                        putDouble("latitude", location.latitude)
                        putDouble("longitude", location.longitude)
                        putDouble("accuracy", location.accuracy.toDouble())
                        putDouble("altitude", location.altitude)
                        putDouble("speed", location.speed.toDouble())
                        putDouble("heading", location.bearing.toDouble())
                        putDouble("timestamp", location.time.toDouble())
                    }
                    promise.resolve(locationMap)
                    // Remove updates after getting location
                    fusedLocationClient.removeLocationUpdates(this)
                }
            }
        }

        try {
            if (ActivityCompat.checkSelfPermission(
                    reactApplicationContext,
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                fusedLocationClient.requestLocationUpdates(
                    locationRequest,
                    singleLocationCallback,
                    Looper.getMainLooper()
                )
            }
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun startLocationUpdates(intervalMs: Int, promise: Promise) {
        // Check permissions
        if (ActivityCompat.checkSelfPermission(
                reactApplicationContext,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            promise.reject("PERMISSION_DENIED", "Location permission not granted")
            return
        }

        val locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            intervalMs.toLong()
        ).apply {
            setMinUpdateIntervalMillis((intervalMs / 2).toLong())
            setWaitForAccurateLocation(false)
        }.build()

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                super.onLocationResult(locationResult)
                val location = locationResult.lastLocation
                if (location != null) {
                    val locationMap = Arguments.createMap().apply {
                        putDouble("latitude", location.latitude)
                        putDouble("longitude", location.longitude)
                        putDouble("accuracy", location.accuracy.toDouble())
                        putDouble("altitude", location.altitude)
                        putDouble("speed", location.speed.toDouble())
                        putDouble("heading", location.bearing.toDouble())
                        putDouble("timestamp", location.time.toDouble())
                    }
                    sendEvent("onLocationUpdate", locationMap)
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback!!,
                Looper.getMainLooper()
            )
            promise.resolve("Location updates started")
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopLocationUpdates(promise: Promise) {
        try {
            locationCallback?.let {
                fusedLocationClient.removeLocationUpdates(it)
                locationCallback = null
                promise.resolve("Location updates stopped")
            } ?: run {
                promise.resolve("No active location updates")
            }
        } catch (e: Exception) {
            promise.reject("LOCATION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun checkLocationPermission(promise: Promise) {
        val hasPermission = ActivityCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        promise.resolve(hasPermission)
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
        }
    }
}