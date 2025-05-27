from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

db = SQLAlchemy()

class TipoIncidente(str, enum.Enum):
    automovilistico = 'automovilistico'
    ciclista = 'ciclista'
    peaton = 'peaton'

class ReportType(str, enum.Enum):
    contenido_inapropiado = 'contenido inapropiado'
    informacion_falsa = 'informacion falsa'
    incidente_irreleante = 'incidente irrelevante'
    lenguaje_ofensivo = 'lenguaje ofensivo'
    spam = 'spam'


class User(db.Model):
    __tablename__= 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(), unique= True, nullable = False)
    name: Mapped[str] = mapped_column(String(), nullable = False)
    phone: Mapped[str] = mapped_column(String(), unique = True, nullable = False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    incident: Mapped[list['Incidentes']] = relationship(back_populates ='user', cascade='all, delete-orphan', lazy ='joined')
    likes: Mapped[list['Likes']] = relationship(back_populates ='user', cascade='all, delete-orphan', lazy ='joined')
    reports: Mapped[list['Reports']] = relationship(back_populates ='user', cascade='all, delete-orphan', lazy ='joined')

    def __repr__(self):
        return f'usuario{self.id}: {self.username}'
   
    def serialize(self):
        return{
            'id': self.id,
            "username": self.username,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "is_admin": self.is_admin
        }


class Incidentes(db.Model):
    __tablename__= 'incidentes'
    id: Mapped[int] = mapped_column(primary_key= True)
    titulo: Mapped[str] = mapped_column(String(), nullable = False)
    image: Mapped[str] = mapped_column(String(), nullable = True)
    longitud: Mapped[str] = mapped_column(String(), nullable = False)
    latitud: Mapped[str] = mapped_column(String(), nullable = False)
    type: Mapped[TipoIncidente]   = mapped_column(Enum(TipoIncidente), nullable = False)
    description: Mapped[str] = mapped_column(String(), nullable = False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    user: Mapped['User'] = relationship(back_populates='incident', lazy = 'joined')
    likes: Mapped[list['Likes']] = relationship(back_populates = 'incident',cascade='all, delete-orphan', lazy = 'joined')
    reports: Mapped[list['Reports']] = relationship(back_populates = 'incident',cascade='all, delete-orphan', lazy = 'joined')

    def serialize(self):
        return{
            'id': self.id,
            'titulo': self.titulo,
            "image": self.image,
            "longitud": self.longitud,
            "latitud": self.latitud,
            "type": self.type,
            "description": self.description,
            "user_id": self.user_id
        }


class Likes(db.Model):
    __tablename__= 'likes'
    id: Mapped[int] = mapped_column(primary_key = True)
    incident_id: Mapped[int] = mapped_column(ForeignKey('incidentes.id'))
    incident: Mapped['Incidentes'] = relationship(back_populates ='likes', lazy = 'joined')
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    user: Mapped['User'] = relationship(back_populates='likes', lazy = 'joined')

class Reports(db.Model):
    __tablename__='reports'
    id: Mapped[int] = mapped_column(primary_key = True)
    incident_id: Mapped[int] = mapped_column(ForeignKey('incidentes.id'))
    incident: Mapped['Incidentes'] = relationship(back_populates ='reports', lazy = 'joined')
    reportType: Mapped[ReportType] = mapped_column(Enum(ReportType), nullable = False)
    description : Mapped[str] = mapped_column(String(), nullable = False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'))
    user: Mapped['User'] = relationship(back_populates='reports', lazy = 'joined')



