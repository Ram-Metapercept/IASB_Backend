<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    exclude-result-prefixes="xs xsi"
    version="2.0">
    
    <xsl:output indent="yes"/>
    
    <xsl:template match="/">
        <xsl:for-each select="//@*">
            <xsl:element name="{name()}" namespace="http://www.w3.org/2001/XMLSchema">
            </xsl:element>
        </xsl:for-each>
    </xsl:template>
    
</xsl:stylesheet>