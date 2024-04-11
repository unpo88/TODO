from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register("todo", viewset=views.TodoViewSet, basename="todo")

urlpatterns = router.urls
