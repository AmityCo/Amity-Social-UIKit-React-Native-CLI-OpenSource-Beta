#import "AppDelegate.h"

#import <AVFoundation/AVFoundation.h> 
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"AmityReactNativeSocialUiKitExample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // For livestream
  AVAudioSession *session = AVAudioSession.sharedInstance;
  NSError *error = nil;

  if (@available(iOS 10.0, *)) {
      [session
        setCategory:AVAudioSessionCategoryPlayAndRecord
        mode:AVAudioSessionModeVoiceChat
        options:AVAudioSessionCategoryOptionDefaultToSpeaker|AVAudioSessionCategoryOptionAllowBluetooth
        error:&error];
    } else {
      SEL selector = NSSelectorFromString(@"setCategory:withOptions:error:");
      
      NSArray * optionsArray =
          [NSArray arrayWithObjects:
            [NSNumber numberWithInteger:AVAudioSessionCategoryOptionAllowBluetooth],
            [NSNumber numberWithInteger:AVAudioSessionCategoryOptionDefaultToSpeaker], nil];
      
      [session
        performSelector:selector
        withObject: AVAudioSessionCategoryPlayAndRecord
        withObject: optionsArray
      ];
      
      [session 
        setMode:AVAudioSessionModeVoiceChat 
        error:&error
      ];
    }
    
    [session 
      setActive:YES 
      error:&error
    ];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
