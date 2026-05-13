<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <style>
        @page {
            margin: 0cm;
        }

        body {
            font-family: 'Helvetica', sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .header {
            background-color: #064e3b;
            color: white;
            padding: 40px 50px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-weight: bold;
        }

        .header p {
            margin: 5px 0 0;
            font-size: 10px;
            letter-spacing: 2px;
            opacity: 0.8;
        }

        .info-bar {
            background-color: #f1f5f9;
            padding: 15px 50px;
            border-bottom: 2px solid #e2e8f0;
            font-family: 'Courier', monospace;
            font-size: 11px;
            font-weight: bold;
        }

        .content {
            padding: 50px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            background-color: white;
        }

        th {
            background-color: #064e3b;
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        td {
            padding: 15px 15px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
        }

        .label {
            color: #64748b;
            font-weight: bold;
            width: 35%;
            font-size: 10px;
            text-transform: uppercase;
        }

        .value-strong {
            font-size: 18px;
            font-weight: bold;
            color: #064e3b;
        }

        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-prioridad-critica { background-color: #fee2e2; color: #dc2626; }
        .badge-prioridad-alta { background-color: #ffedd5; color: #ea580c; }
        .badge-prioridad-media { background-color: #dbeafe; color: #2563eb; }
        .badge-prioridad-baja { background-color: #f1f5f9; color: #64748b; }

        .badge-estado-resuelto { background-color: #dcfce7; color: #16a34a; }
        .badge-estado-en-proceso { background-color: #fef9c3; color: #ca8a04; }
        .badge-estado-pendiente { background-color: #f1f5f9; color: #64748b; }

        .descripcion-box {
            background-color: #f8fafc;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin-top: 10px;
            font-size: 12px;
            color: #475569;
        }

        .footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 30px 0;
            text-align: center;
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }

        .signature {
            margin-top: 60px;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid #cbd5e1;
            width: 200px;
            margin: 0 auto 10px;
        }
    </style>
</head>

<body>

    <div class="header">
        <h1>Reporte de Auditoría Energética</h1>
        <p>GENLI ENERGY SOLUTION S.A.S — SISTEMA DE INTEGRIDAD DE DATOS</p>
    </div>

    <div class="info-bar">
        FOLIO DE REGISTRO: #{{ str_pad($registro->idRegistro, 5, '0', STR_PAD_LEFT) }}
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        EMISIÓN: {{ \Carbon\Carbon::parse($registro->fecha)->format('d/m/Y H:i:s') }}
    </div>

    <div class="content">
        <table>
            <thead>
                <tr>
                    <th>Concepto Técnico</th>
                    <th>Detalle de Auditoría</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="label">Ubicación / Barrio</td>
                    <td>{{ strtoupper($registro->barrio) }}</td>
                </tr>
                <tr>
                    <td class="label">Magnitud de Pérdida</td>
                    <td class="value-strong">{{ number_format($registro->pEnergia, 2) }} kWh</td>
                </tr>
                <tr>
                    <td class="label">Clasificación de Pérdida</td>
                    <td>
                        {{ $registro->tipo == 'Tecnica' ? '⚙️ PÉRDIDA TÉCNICA' : '⚠️ PÉRDIDA NO TÉCNICA' }}
                    </td>
                </tr>
                <tr>
                    <td class="label">Prioridad</td>
                    <td>
                        @php
                            $prioridadClass = 'badge-prioridad-' . strtolower($registro->prioridad);
                        @endphp
                        <span class="badge {{ $prioridadClass }}">{{ $registro->prioridad ?? 'Media' }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Estado</td>
                    <td>
                        @php
                            $estadoClass = 'badge-estado-' . str_replace(' ', '-', strtolower($registro->estado ?? 'Pendiente'));
                        @endphp
                        <span class="badge {{ $estadoClass }}">{{ $registro->estado ?? 'Pendiente' }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Tipo de Instalación</td>
                    <td>{{ $registro->tipo_instalacion ?? 'No especificado' }}</td>
                </tr>
                <tr>
                    <td class="label">Causa de la Pérdida</td>
                    <td>{{ $registro->causa ?? 'No especificada' }}</td>
                </tr>
                <tr>
                    <td class="label">Usuarios Afectados</td>
                    <td><strong>{{ $registro->usuarios_afectados ?? 0 }}</strong> usuarios</td>
                </tr>
            </tbody>
        </table>

        @if($registro->descripcion)
        <table style="margin-top: 20px;">
            <thead>
                <tr>
                    <th>Descripción del Problema</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="descripcion-box">
                            {{ $registro->descripcion }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        @endif

        <div class="signature">
            <div class="signature-line"></div>
            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">
                Firma Responsable Técnico
            </span>
        </div>
    </div>

    <div class="footer">
        Este documento es un reporte oficial emitido por Genli Energy Solution S.A.S<br>
        Pasto, Nariño, Colombia — {{ date('Y') }}
    </div>

</body>

</html>