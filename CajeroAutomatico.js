class Usuario {
    constructor(identificacion, usuario, correo, clave, saldoInicial = 100000) {
        this.identificacion = identificacion;
        this.usuario = usuario;
        this.correo = correo;
        this.clave = clave;
        this.movimientos = [{
            fecha: new Date().toLocaleString(),
            concepto: "Saldo Inicial",
            valor: saldoInicial,
            saldo: saldoInicial
        }];
    }
  }
  
  class CajeroAutomatico {
    constructor() {
        this.usuariosRegistrados = JSON.parse(sessionStorage.getItem('usuarios')) || [];
        this.usuarioLoggeado = null;
  
        console.log("Usuarios registrados en sesión:", this.usuariosRegistrados);
    }
    logUsuariosYMovimientos() {
        this.usuariosRegistrados.forEach(usuario => {
            console.log(`Usuario: ${usuario.usuario}`);
            usuario.movimientos.forEach(movimiento => {
                console.log(`  Fecha: ${movimiento.fecha}, Concepto: ${movimiento.concepto}, Valor: ${movimiento.valor}, Saldo: ${movimiento.saldo}`);
            });
        });
    }
    registrarUsuario(event) {
        event.preventDefault();
        const identificacion = document.getElementById('identificacion').value;
        const usuario = document.getElementById('usuario').value;
        const correo = document.getElementById('correo').value;
        const clave = document.getElementById('clave').value;
        const repetirClave = document.getElementById('repetirClave').value;
        //ESTE REGEX ES PARA LOS CARACTERES ESPECIALES EN LA CONTRASEÑA  --Michael
       // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

       // if (!passwordRegex.test(clave)) {
       //     alert('La clave debe tener al menos una mayúscula, un número y seis caracteres');
       //     return false;
        //}

        if (clave.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return false;
             }
  
        if (clave !== repetirClave) {
            alert('Las claves no coinciden');
            console.log('Validation failed: passwords do not match.');
            return false;
        }
  
        
  
        const nuevoUsuario = new Usuario(identificacion, usuario, correo, clave);
        this.usuariosRegistrados.push(nuevoUsuario);
        sessionStorage.setItem('usuarios', JSON.stringify(this.usuariosRegistrados));
        alert('Usuario registrado exitosamente');
  
        document.getElementById('formulario').reset();
        this.mostrarInicio();
        return true;
    }
  
    iniciarSesion() {
        const usuario = document.getElementById('usuarioInicio').value;
        const clave = document.getElementById('claveInicio').value;
  
        const resultado = this.usuariosRegistrados.find(
            el => el.usuario === usuario && el.clave === clave
        );
  
        if (resultado) {
            this.usuarioLoggeado = resultado;
            document.getElementById('iniciar').style.display = 'none';
            document.getElementById('menuUsuario').style.display = 'block';
            alert('Inicio de sesión exitoso');
        } else {
            alert('Nombre de usuario o contraseña incorrectos');
        }
    }
  
    consultarSaldo() {
        const saldo = this.usuarioLoggeado.movimientos.reduce((acc, mov) => acc + mov.valor, 0);
        alert(`Saldo actual: $${saldo}`);
    }
  
    retirar() {
        const monto = parseFloat(prompt("Ingrese el monto a retirar:"));
        const saldoActual = this.usuarioLoggeado.movimientos.reduce((acc, mov) => acc + mov.valor, 0);
  
        if (monto > saldoActual) {
            alert("No tienes suficiente saldo.");
        } else {
            this.usuarioLoggeado.movimientos.push({
                fecha: new Date().toLocaleString(),
                concepto: "Retiro",
                valor: -monto,
                saldo: saldoActual - monto
            });
            sessionStorage.setItem('usuarios', JSON.stringify(this.usuariosRegistrados));
            alert(`Retiro exitoso. Saldo restante: $${saldoActual - monto}`);
        }
    }
  
    consignar() {
        const monto = parseFloat(prompt("Ingrese el monto a consignar:"));
        if (monto < 0) {
            alert("No puedes consignar un monto negativo.");
        } else {
            const saldoActual = this.usuarioLoggeado.movimientos.reduce((acc, mov) => acc + mov.valor, 0);
            this.usuarioLoggeado.movimientos.push({
                fecha: new Date().toLocaleString(),
                concepto: "Consignación",
                valor: monto,
                saldo: saldoActual + monto
            });
            sessionStorage.setItem('usuarios', JSON.stringify(this.usuariosRegistrados));
            alert(`Consignación exitosa. Saldo actual: $${saldoActual + monto}`);
        }
    }
  
    consultarMovimientos() {
        document.getElementById('menuUsuario').style.display = 'none';
        document.getElementById('movimientos').style.display = 'block';
  
        const movimientosTable = document.getElementById('movimientosTable');
        movimientosTable.innerHTML = "";
  
        let headers = movimientosTable.insertRow();
        headers.insertCell(0).innerText = "Fecha y Hora";
        headers.insertCell(1).innerText = "Concepto";
        headers.insertCell(2).innerText = "Valor";
        headers.insertCell(3).innerText = "Saldo";
  
        this.usuarioLoggeado.movimientos.forEach((movimiento) => {
            let row = movimientosTable.insertRow();
            row.insertCell(0).innerText = movimiento.fecha;
            row.insertCell(1).innerText = movimiento.concepto;
            row.insertCell(2).innerText = movimiento.valor;
            row.insertCell(3).innerText = movimiento.saldo;
        });
    }
  
    mostrarInicio() {
      document.getElementById('registro').style.display = 'none';
      document.getElementById('iniciar').style.display = 'block';
      document.getElementById('tablaAdmin').style.display = 'none';
      document.getElementById('usuarioInicio').value = '';
      document.getElementById('claveInicio').value = '';
    }
  
    mostrarRegistrar() {
        document.getElementById('iniciar').style.display = 'none';
        document.getElementById('tablaAdmin').style.display = 'none';
        document.getElementById('registro').style.display = 'block';
    }
  
    logout() {
        this.usuarioLoggeado = null;
        document.getElementById('menuUsuario').style.display = 'none';
        this.mostrarInicio();
    }
  
    regresar() {
        document.getElementById('movimientos').style.display = 'none';
        document.getElementById('menuUsuario').style.display = 'block';
    }
  
    mostrarMenuUsuario() {
        document.getElementById('administrarUsuarios').style.display = 'none';
        document.getElementById('menuUsuario').style.display = 'block';
    }
  
    tablaAdmin() {
        document.getElementById('iniciar').style.display = 'none';
        const tablaUsuarios = document.getElementById('usuariosTable');
    
        
        tablaUsuarios.innerHTML = '';
    
       
        let headerRow = tablaUsuarios.insertRow();
        headerRow.innerHTML = '<th>Identificación</th><th>Usuario</th><th>Correo</th><th>Acción</th>';
    
     
        if (this.usuariosRegistrados.length === 0) {
            console.log("0 Usuarios");
            let noUsersRow = tablaUsuarios.insertRow();
            let cell = noUsersRow.insertCell();
            cell.colSpan = 4; 
            cell.innerText = 'No Usuarios Registrados';
        } else {
           
            this.usuariosRegistrados.forEach(usuario => {
                let row = tablaUsuarios.insertRow();
                row.innerHTML = `<td>${usuario.identificacion}</td>
                <td>${usuario.usuario}</td>
                <td>${usuario.correo}</td>
                <td>
                   <button onclick="cajero.editarUsuario('${usuario.identificacion}')">Editar</button>
                   <button onclick="cajero.eliminarUsuario('${usuario.identificacion}')">Eliminar</button>
                    
                </td>`;
            });
        }
    
    // Add the eliminarUsuario method to the CajeroAutomatico class
        document.getElementById('tablaAdmin').style.display = 'block';
    
    }
    // Add the eliminarUsuario method to the CajeroAutomatico class
eliminarUsuario(identificacion) {
    const confirmar = confirm("¿Está seguro que desea eliminar este usuario?");
    if (confirmar) {
        this.usuariosRegistrados = this.usuariosRegistrados.filter(user => user.identificacion !== identificacion);
        sessionStorage.setItem('usuarios', JSON.stringify(this.usuariosRegistrados));
        this.tablaAdmin();
        alert("Usuario eliminado correctamente.");
    }
}
    
    editarUsuario(identificacion) {
     
        const usuario = this.usuariosRegistrados.find(user => user.identificacion === identificacion);
        if (usuario) {
           
            const nuevoUsuario = prompt(`Editar usuario ${usuario.usuario}`, JSON.stringify(usuario));
            if (nuevoUsuario) {
                
                const index = this.usuariosRegistrados.findIndex(user => user.identificacion === identificacion);
                this.usuariosRegistrados[index] = JSON.parse(nuevoUsuario);
              
                this.tablaAdmin();
               
                sessionStorage.setItem('usuarios', JSON.stringify(this.usuariosRegistrados));
            }
        }
    }
    


  
    cambiarClave() {
        const nuevaClave = prompt("Ingrese la nueva clave:");
        const repetirClave = prompt("Repita la nueva clave:");
        if (nuevaClave === repetirClave) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
            if (!passwordRegex.test(nuevaClave)) {
                alert('La clave debe tener al menos una mayúscula, un número y seis caracteres');
                console.log('Validation failed: new password does not meet criteria.');
                return false;
            }
            this.usuarioLoggeado.clave = nuevaClave;
            sessionStorage.setItem('usuarios', JSON.stringify(this.usuariosRegistrados));
            alert("Clave cambiada exitosamente.");
        } else {
            alert("Las claves no coinciden.");
        }
    }
  }
  
  const cajero = new CajeroAutomatico();
  