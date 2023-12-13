import React from 'react';
import { Document, Text, Page, StyleSheet, View, PDFViewer } from '@react-pdf/renderer';
import {Col, Button, Row, Container, Card, Form} from 'react-bootstrap';

const styles = StyleSheet.create({
    page: {
        marginTop: 0,
        fontSize: 13,
        padding: 20,
    },
    layout: {
        marginTop: 0,
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    p: {
        textAlign: 'center'
    },
    h2: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    }
});

const PagePdf = () => (
    <PDFViewer>
        <Document>
            <Page size="A4" style={styles.page} orientation="portrait">
                <View style={styles.layout}>
                        <Text style={styles.h2}>Recibo</Text>
                </View>
                <View style={styles.layout}>
                    <Text>

                        Eu ________________________________________________, recebi de <span className="font-weight-bold"></span>
                        - CPF/CNPJ nº <span className="font-weight-bold"></span>,
                        a importância de <span className="font-weight-bold"></span>
                    </Text>
                </View>
            </Page>
        </Document>
    </PDFViewer>
);

export default PagePdf;