;/*FB_PKG_DELIM*/

__d("LSDeleteAllDeliverySettingWarnings",[],(function(a,b,c,d,e,f){function a(){var a=arguments,b=a[a.length-1],c=[];return b.resolve(c)}a.__sproc_name__="LSOmnistoreSettingsDeleteAllDeliverySettingWarningsStoredProcedure";a.__tables__=[];e.exports=a}),null);
__d("LSTruncateFeatureLimits",[],(function(a,b,c,d,e,f){function a(){var a=arguments,b=a[a.length-1],c=[];return b.sequence([function(a){return b.forEach(b.db.table(150).fetch(),function(a){return a["delete"]()})},function(a){return b.resolve(c)}])}a.__sproc_name__="LSOmnistoreSettingsTruncateFeatureLimitsStoredProcedure";a.__tables__=["feature_limits"];e.exports=a}),null);
__d("LSTruncateReachabilitySettings",[],(function(a,b,c,d,e,f){function a(){var a=arguments,b=a[a.length-1],c=[];return b.sequence([function(a){return b.forEach(b.db.table(148).fetch(),function(a){return a["delete"]()})},function(a){return b.resolve(c)}])}a.__sproc_name__="LSOmnistoreSettingsTruncateReachabilitySettingsStoredProcedure";a.__tables__=["reachability_settings"];e.exports=a}),null);