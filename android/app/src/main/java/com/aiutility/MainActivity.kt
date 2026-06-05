package com.aiutility

import android.graphics.Color
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)

    WindowCompat.setDecorFitsSystemWindows(window, true)
    window.navigationBarColor = Color.parseColor("#003a6b")
    val controller = WindowInsetsControllerCompat(window, window.decorView)
    controller.isAppearanceLightNavigationBars = false
  }

  override fun getMainComponentName(): String = "AIUtility"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(
      this,
      mainComponentName,
      fabricEnabled
    )
}