export default function(context) {
  if (!context.store.getters["user_profile/isAuthenticated"]) {
   context.redirect('/landing')
  }
}