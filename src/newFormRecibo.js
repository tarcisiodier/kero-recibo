import {Col, Button, Row, Container, Card, Form} from 'react-bootstrap';
import React, {useState, useRef, useEffect} from 'react';
import CurrencyInput from 'react-currency-masked-input'
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';
import {utcToZonedTime} from 'date-fns-tz';
import './FormRecibo.css';
import IntlCurrencyInput from "react-intl-currency-input"
import ReactToPrint from "react-to-print";


const currencyConfig = {
    locale: "pt-BR",
    formats: {
        number: {
            BRL: {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
    },
};




function NewFormRecibo() {
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [selectedEmpresaData, setSelectedEmpresaData] = useState(null);
    const [selectFormaPagamentos,  setSelectedFormaPagamentos] = useState(null)
    const [valorDiaria, setValorDiaria] = useState('');
    const [diasTrabalhados, setDiasTrabalhados] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [valorPassagem, setValorPassagem] = useState('');
    const [numPassagem, setNumPassagem] = useState('');
    const [valorTotalPassagem, setValorTotalPassagem] = useState('');
    const [decimoTerceiro, setDecimoTerceiro] = useState('');
    const [ferias, setFerias] = useState('');
    const [insalubridade, setInsalubridade] = useState(false);
    const [valorInsalubridade, setValorInsalubridade] = useState('');
    const [maxRecibo, setMaxRecibo] = useState(1);
    const [isDisabled, setIsDisabled] = useState(false);
    let componentRef = useRef();

    //SELECT EMPRESA
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
        },
        {
            nome:'DBCOMPLEX LTDA',
            cnpj: '500328170001-10'
        },
        {
            nome: 'DBCAXIAS COMERCIO DE ALIMENTOS LTDA',
            cnpj: '489659720001-47'
        }

    ]

    const formaPagamento = [
        {
            'nome': 'Dinheiro',
            'value': 'em DINHEIRO.'
        },
        {
            'nome': 'PIX',
            'value': 'por PIX.'
        },
        {
            'nome': 'TED',
            'value': 'por TED.'
        },
        {
            'nome': 'Dinheiro e Transferência Bancária',
            'value': 'uma parte em DINHEIRO e o restante por Transferência Bancária.'
        },
    ]
    const handleChangeEmpresa = (event) => {
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

    const handleChangeFormaPagamento = (event) => {
        const selectedTipo = event.target.value;
        setSelectedFormaPagamentos(selectedTipo);
    };

    const formatBR = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    }
    const handleChangeValorDiaria = (event, value, maskedValue) => {
        event.preventDefault();
        setValorDiaria(value);
        console.log(value); // value without mask (ex: 1234.56)
        console.log(maskedValue); // masked value (ex: R$1234,56)
    };

    const handleChangeValorPassagem = (event, value, maskedValue) => {
        event.preventDefault();
        setValorPassagem(value);
        console.log(value); // value without mask (ex: 1234.56)
        console.log(maskedValue); // masked value (ex: R$1234,56)
    };

    useEffect(() => {
        if(valorDiaria > 0 && diasTrabalhados > 0 && valorTotalPassagem !== null){
            const DIAS_MES = 30
            const valorTotal = (valorDiaria * diasTrabalhados) - valorTotalPassagem
            const valorTotalSemDesconto = valorDiaria * diasTrabalhados
            setValorTotal(formatBR(valorTotalSemDesconto));
            const totalDias = diasTrabalhados * 12
            setDecimoTerceiro(formatBR((valorTotal/ totalDias).toFixed(2) * diasTrabalhados));
            const percentual = 33.33 / 100
            const valorFerias = (valorTotal * percentual).toFixed(2)
            console.log('valor ferias', valorFerias); // value without mask (ex: 1)
            setFerias(formatBR((valorFerias / totalDias).toFixed(2) * diasTrabalhados));
            const calcInsalubridade = ((1320 / DIAS_MES) * (20 / 100)) * diasTrabalhados;
            setValorInsalubridade(formatBR(calcInsalubridade));
        } else {
            setValorTotal('');
        }

        if(valorPassagem > 0 && numPassagem > 0){
            setValorTotalPassagem(valorPassagem * numPassagem);
        } else {
            setValorTotalPassagem('');
        }


    }, [valorDiaria, diasTrabalhados, valorPassagem, numPassagem, valorTotalPassagem]);

    const clonarDiv = (e) => {
        e.preventDefault();
        // Suponha que a classe da div que você quer clonar seja 'minha-classe'
        let divOriginal = document.querySelector('.divPrint'); // Seleciona a primeira div com essa classe

        // Clona a div, incluindo seu conteúdo interno
        let divClonada = divOriginal.cloneNode(true);

        // Insere a div clonada após a div original no DOM
        divOriginal.parentNode.insertBefore(divClonada, divOriginal.nextSibling);

        if(maxRecibo === 3){
            setIsDisabled(true);
            alert('Máximo de recibos permitidos: 4');
        } else {
            setMaxRecibo(maxRecibo + 1);
        }
    }

    const handleChangeInsalubridade = () => {
        setInsalubridade(!insalubridade);
    };
    const handleConfirm = () => {
        const confirmed = window.confirm("Limpar recibos?");
        if (confirmed) {
            window.location.reload();
        }
    };

    return(
        <>
            <Container>
                <Row className="d-flex justify-content-center align-items-center">
                    <Form>
                        <Row>
                            <Col xs={6}>
                                <Form.Group className="mb-3" controlId="formBasicEmpresa">
                                    <Form.Label>Empresa</Form.Label>
                                    <Form.Select aria-label="Default select example" id="empresaSelect"
                                                 value={selectedEmpresa} onChange={handleChangeEmpresa}>
                                        <option>Selecione a Empresa</option>
                                        {empresas.map((empresa, index) => (
                                            <option key={index} value={empresa.cnpj}>
                                                {empresa.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="formBasicValor">
                                    <Form.Label>Valor do Dia</Form.Label>
                                    <IntlCurrencyInput currency="BRL" config={currencyConfig}
                                                       onChange={handleChangeValorDiaria} className="form-control"/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="formBasicValor">
                                    <Form.Label>Dias Trabalhados</Form.Label>
                                    <Form.Control name="dias_trabalhados" required className="form-control"
                                                  onChange={(e) => setDiasTrabalhados(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="formBasicPassagem">
                                    <Form.Label>Valor Passagem</Form.Label>
                                    <IntlCurrencyInput currency="BRL" config={currencyConfig}
                                                       onChange={handleChangeValorPassagem} className="form-control"/>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="formBasicNumPassagem">
                                    <Form.Label>Passagem(s)</Form.Label>
                                    <Form.Control type="number" name="num_passagem" required className="form-control"
                                                  onChange={(e) => setNumPassagem(e.target.value)}/>
                                </Form.Group>
                            </Col>

                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="formBasicFormadePagamento">
                                    <Form.Label>Forma de Pagamento</Form.Label>
                                    <Form.Select aria-label="Default select example" id="formBasicFormadePagamento"
                                                 value={selectFormaPagamentos} onChange={handleChangeFormaPagamento}>
                                        <option value="Selecione uma forma de pagamento!">Selecione um Opção</option>
                                        {formaPagamento.map((forma, index) => (
                                            <option key={index} value={forma.value}>
                                                {forma.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="formBasicNumPassagem">
                                    <Form.Label>Insalubridade</Form.Label>
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id="custom-switch"
                                        label="Clique para Sim"
                                        checked={insalubridade}
                                        onChange={handleChangeInsalubridade}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Row>
                <Row>
                    <Col xs={6}>
                        <ReactToPrint
                            trigger={() => <Button>IMPRIMIR!</Button>}
                            content={() => componentRef}
                        />

                        <Button variant="warning" onClick={clonarDiv} style={{ marginLeft: '10px' }} disabled={isDisabled}>COPIAR RECIBO</Button>
                        <Button variant="danger" onClick={handleConfirm} style={{ marginLeft: '10px' }} >LIMPAR RECIBOS</Button>
                    </Col>

                </Row>
                <hr/>
                <Row media="print" style={{ marginTop: '30px', padding: '0px 20px'}} ref={(el) => (componentRef = el)}>
                    <div className="divPrint">
                    <Row>
                        <h3>Recibo</h3>
                        <p>Eu ________________________________________________, recebi de <span className="font-weight-bold">{selectedEmpresaData ? (selectedEmpresaData.nome):('SELECIONE UMA EMPRESA')}</span>
                            - CPF/CNPJ nº <span className="font-weight-bold">{selectedEmpresaData ? (selectedEmpresaData.cnpj):('XXXXXXXXXXXX-XX')}</span>,
                            a importância de <span className="font-weight-bold">{valorTotal ||
                                'R$ 0.00'}</span> {selectFormaPagamentos || 'Selecione uma forma de pagamento!'}
                        </p>
                        <p>
                            Este valor inclui o pagamento antecipado referente aos itens discriminados abaixo:
                        </p>
                    </Row>
                    <Row>
                        <Col style={{ width: '100px', backgroundColor: '#fafafa'}} className="fontPrint">
                            <p className="font-weight-bold mt-3">Transporte:</p>
                            <ul style={{ marginTop: '-15px'}}>
                                <li>Passagens: <span className="font-weight-bold">{numPassagem || 0}</span></li>
                                <li>Valor da Passagem: <span
                                    className="font-weight-bold">{formatBR(valorPassagem) || 'R$ 0,00'}</span>
                                </li>
                                <li>Total: <span
                                    className="font-weight-bold">{formatBR(valorTotalPassagem) || 'R$ 0,00'}</span>
                                </li>
                            </ul>
                        </Col>
                        <Col style={{ width: '100px',  backgroundColor: '#fafafa'}} className="fontPrint">
                            <p className="font-weight-bold mt-3">13º proporcional aos dias trabalhados:</p>
                            <ul style={{ marginTop: '-15px'}}>
                                <li>Valor: <span
                                    className="font-weight-bold">{decimoTerceiro || 'R$ 0,00'}</span>
                                </li>
                            </ul>
                            {insalubridade && (
                                <>
                                <p className="font-weight-bold mt-3">Insalubridade:</p>
                                <ul style={{ marginTop: '-15px'}}>
                                    <li>Valor: <span
                                        className="font-weight-bold">{valorInsalubridade || 'R$ 0,00'}</span>
                                    </li>
                                </ul>
                                </>
                            )}
                        </Col>
                        <Col style={{ width: '100px',  backgroundColor: '#fafafa'}} className="fontPrint">
                            <p className="font-weight-bold mt-3">Férias proporcionais aos dias trabalhados:</p>
                            <ul style={{ marginTop: '-15px'}}>
                                <li>Valor: <span
                                    className="font-weight-bold">{ferias || 'R$ 0,00'}</span>
                                </li>
                            </ul>
                        </Col>
                        <Col style={{ width: '150px'}} className="fontPrint">
                            <hr/>
                            <p className="font-weight-bold text-center" style={{ margin: '-15px 0 30px 0'}}>Data</p>
                            <hr/>
                            <p className="font-weight-bold text-center" style={{ margin: '-15px 0 30px 0'}}>Assinatura</p>
                            <hr/>
                            <p className="font-weight-bold text-center" style={{ margin: '-15px 0 10px 0'}}>Documento</p>
                        </Col>
                        <hr/>
                    </Row>
                    </div>
                </Row>

            </Container>
        </>
    )
}



export default NewFormRecibo;