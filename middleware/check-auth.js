export default function(context){
    context.store.dispatch("user_profile/initAuth",context.req)
}