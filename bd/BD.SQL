CREATE TABLE public.roles (
	id_rol serial4 NOT NULL,
	role_name text NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id_rol)
);
CREATE TABLE public.usuarios (
	id_usuario serial4 NOT NULL,
	"name" text NOT NULL,
	last_name text NULL,
	email text NOT NULL,
	cedula numeric NULL,
	"password" text NOT NULL,
	phone_number numeric NOT NULL,
	image text NULL,
	id_rol serial4 NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario)
);

ALTER TABLE public.usuarios ADD CONSTRAINT fk_roles FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol) ON DELETE CASCADE;


CREATE TABLE public.categoria (
	id_categoria serial4 NOT NULL,
	nombre text NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria)
);



CREATE TABLE public.detalle_producto (
	id_producto serial4 NOT NULL,
	marca varchar(255) NOT NULL,
	nombre text NOT NULL,
	descripcion text NOT NULL,
	precio numeric NOT NULL,
	id_estado bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	categorias int4 NULL,
	image text NULL,
	CONSTRAINT detalle_producto_pkey PRIMARY KEY (id_producto)
);
CREATE INDEX detalle_producto_id_producto_idx ON public.detalle_producto USING btree (id_producto, nombre, marca, descripcion, precio, categorias, id_estado, created_at);



ALTER TABLE public.detalle_producto ADD CONSTRAINT detalle_producto_categoria_fk FOREIGN KEY (categorias) REFERENCES public.categoria(id_categoria);