import os
from flask_admin import Admin
from .models import db, User, Incidentes, Likes, Reports
from flask_admin.contrib.sqla import ModelView
from sqlalchemy.orm import class_mapper, RelationshipProperty

####### RECUERDEN QUE ESTOS EJEMPLOS FUNCIONAN PARA LAS TABLAS QUE YO CREE EN CLASE
####### UDS ACOMODENLO AL DE SUS PROYECTOS

class UserModelView(ModelView):
    column_auto_select_related = True  # Carga automáticamente las relaciones
    # Columnas y relationships de mi tabla PeopleFavorites
    column_list = ['id', 'username', 'name', 'phone', 'email', 'password', 'is_active', 'is_admin', 'incident', 'likes' , 'reports']


class IncidentesModelView(ModelView):
    column_auto_select_related = True  # Carga automáticamente las relaciones
    # Columnas y relationships de mi tabla PeopleFavorites
    column_list = ['id', 'titulo','image', 'longitud', 'latitud', 'type', 'description', 'user_id', 'user', 'likes', 'reports']

class LikesModelView(ModelView):
    column_auto_select_related = True  # Carga automáticamente las relaciones
    # Columnas y relationships de mi tabla PeopleFavorites
    column_list = ['id', 'incident_id', 'incident', 'user_id', 'user']  

class ReportsModelView(ModelView):
    column_auto_select_related = True  # Carga automáticamente las relaciones
    # Columnas y relationships de mi tabla PeopleFavorites
    column_list = ['id', 'incident_id', 'incident', 'reportType', 'description', 'user_id', 'user']      



def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')




    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(UserModelView(User, db.session))
    admin.add_view(IncidentesModelView(Incidentes, db.session))
    admin.add_view(LikesModelView(Likes, db.session))
    admin.add_view(ReportsModelView(Reports, db.session))
    