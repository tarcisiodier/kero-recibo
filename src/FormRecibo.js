import {Col, Button, Row, Container, Card, Form} from 'react-bootstrap';
import React, {useState, useRef} from 'react';
import CurrencyInput from 'react-currency-masked-input'
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {utcToZonedTime} from 'date-fns-tz';
import './FormRecibo.css';

function FormRecibo() {

    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [selectedEmpresaData, setSelectedEmpresaData] = useState(null);
    const [valorDiaria, setValorDiaria] = useState('');
    const [valorPassagem, setValorPassagem] = useState('');
    const [numPassagem, setNumPassagem] = useState('');
    const [diasTrabalhados, setDiasTrabalhado] = useState(0);
    const divToPrint = useRef(null);
    const currentDate = new Date();
    const timeZone = 'America/Sao_Paulo'
    const zonedDate = utcToZonedTime(currentDate, timeZone);
    const formattedDate = format(currentDate, 'dd/MM/yyyy');
    const currentTimestamp = new Date().getTime();

    // Formata a data por extenso em português do Brasil
    const formattedDateLong = format(zonedDate, 'dd/MMMM/yyyy', {locale: ptBR});

    const empresas = [
        {
            nome: 'DIER E BOSSLE COMERCIO DE ALIMENTOS LTDA',
            cnpj: '313810630001-69'
        },
        {
            nome: 'CARBONI E DIER COMERCIO DE ALIMENTOS LTDA',
            cnpj: '368497080001-69'
        },
        {
            nome: 'PED COMERCIO DE ALIMENTOS LTDA',
            cnpj: '380299610001-00'
        }
    ]

    const handlePrint = () => {
        const printContents = divToPrint.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();

        document.body.innerHTML = originalContents;
    };

    const handleChangeDiaria = (e) => {
        const inputValue = e.target.value;
        const formattedNumber = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(inputValue * 10);
        setValorDiaria(formattedNumber);
    };

    const valorTotalPassagem = (passagem, dias) => {
        let valorTotal = passagem * dias;
        valorTotal = valorTotal * 10
        console.log(valorTotal);
        const formattedNumber = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(valorTotal)
        return formattedNumber;
    }

    const valorDecimoTerceiro = (valor, dias) => {

        const valorFormatado = valor.replace(/\s+|R\$/g, '').replace(',', '.');
        console.log('valor formatado', valorFormatado)

        const totalDias = dias * 12
        console.log('total dias', totalDias)
        const valorTotal = valorFormatado * dias;
        console.log('valor total', valorTotal);
        const valorFracionado = valorTotal / totalDias;
        console.log('valor fracionado', valorFracionado);
        const valorFinal = valorFracionado * dias
        const formattedNumber = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(valorFinal)
        return formattedNumber;
    }

    const valorFerias = (valor, dias) => {
        console.log(valor)
        let valorFormatado = valor.replace(/\s+|R\$/g, '').replace(',', '.');
        const totalDias = dias * 12
        const valorTotal = valorFormatado * dias;
        const valorDivido = valorTotal / 3
        const valorFracionado = valorDivido / totalDias;

        console.log(valorFracionado);
        const formattedNumber = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(valorFracionado)
        return formattedNumber;
    }

    const handleChangeDiasTrabalhados = (e) => {
        const inputValue = e.target.value;
        setDiasTrabalhado(inputValue);
    }

    const handleChangeNumPassagem = (e) => {
        const inputValue = e.target.value;
        setNumPassagem(inputValue);
    }

    const handleChangeValorPassagem = (e) => {
        const inputValue = e.target.value;
        setValorPassagem(inputValue);
    }

    const handleChange = (event) => {
        const selectedCnpj = event.target.value;
        setSelectedEmpresa(selectedCnpj);

        // Encontrar a empresa correspondente com base no CNPJ selecionado
        const empresa = empresas.find((e) => e.cnpj === selectedCnpj);

        if (empresa) {
            setSelectedEmpresaData(empresa);
        } else {
            setSelectedEmpresaData(null);
        }
    };



    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center">
                <Form>
                    <Row>
                        <Col xs={4}>
                            <Form.Group className="mb-3" controlId="formBasicEmpresa">
                                <Form.Label>Empresa</Form.Label>
                                <Form.Select aria-label="Default select example" id="empresaSelect"
                                             value={selectedEmpresa} onChange={handleChange}>
                                    <option>Selecione a Empresa</option>
                                    {empresas.map((empresa, index) => (
                                        <option key={index} value={empresa.cnpj}>
                                            {empresa.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group className="mb-3" controlId="formBasicValor">
                                <Form.Label>Valor do Dia</Form.Label>
                                <CurrencyInput name="valor_diaria" required className="form-control"
                                               onChange={handleChangeDiaria}/>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group className="mb-3" controlId="formBasicValor">
                                <Form.Label>Dias Trabalhados</Form.Label>
                                <Form.Control name="dias_trabalhados" required className="form-control"
                                              onChange={handleChangeDiasTrabalhados}/>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group className="mb-3" controlId="formBasicPassagem">
                                <Form.Label>Valor Passagem</Form.Label>
                                <CurrencyInput name="valor_passagem" required className="form-control"
                                               onChange={handleChangeValorPassagem}/>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group className="mb-3" controlId="formBasicNumPassagem">
                                <Form.Label>Passagem(s)</Form.Label>
                                <Form.Control type="number" name="num_passagem" required className="form-control"
                                              onChange={handleChangeNumPassagem}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" onClick={handlePrint}>
                        Imprimir
                    </Button>

                </Form>
            </Row>
            <Row >
                <Row ref={divToPrint} style={{marginTop: '30px', padding: '10px'}} id="print">
                    {selectedEmpresaData && (
                        <>
                        <Row id="recibo">
                            <h2>RECIBO</h2>
                                <br/>
                                <br/>
                                <p>Eu ________________________________________________, recebi de <span className="font-weight-bold">{selectedEmpresaData.nome}</span>
                                    - CPF/CNPJ nº <span className="font-weight-bold">{selectedEmpresaData.cnpj}</span>,
                                    a importância de <span className="font-weight-bold">{valorDiaria ||
                                        'R$ 0.00'}</span>
                                </p>
                                <p>
                                    Este valor inclui o pagamento antecipado referente aos itens discriminados abaixo:
                                </p>
                            </Row>
                            <Row>
                            <Col md={{ span: 6 }} id="col-1">
                                <div>
                                    <p className="font-weight-bold">Transporte:</p>
                                    <ul>
                                        <li>Passagens: <span className="font-weight-bold">{numPassagem || 0}</span></li>
                                        <li>Valor da Passagem: <span
                                            className="font-weight-bold">{valorTotalPassagem(valorPassagem, 1)}</span>
                                        </li>
                                        <li>Total: <span
                                            className="font-weight-bold">{valorTotalPassagem(valorPassagem, numPassagem)}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-weight-bold">13º proporcional ao dia trabalhado:</p>
                                    <ul>
                                        <li>Valor: <span className="font-weight-bold">{valorDecimoTerceiro(valorDiaria, diasTrabalhados)}</span></li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-weight-bold">Férias proporcionais ao dia trabalhado:</p>
                                    <ul>
                                        <li>Valor: <span className="font-weight-bold">{valorFerias(valorDiaria, diasTrabalhados)}</span></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col md={{ span: 5 }} className="text-center" style={{ padding: "0 10px"}} id="col-2">
                                <br/>
                                <hr/>
                                <p>Data</p>
                                <br/>
                                <hr/>
                                <p>Assinatura</p>
                                <br/>
                                <hr/>
                                <p>Documento de Identificação</p>
                            </Col>
                        </Row>
                        </>
                    )}
                </Row>
            </Row>
        </Container>

    );
}

export default FormRecibo;