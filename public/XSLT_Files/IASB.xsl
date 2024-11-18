<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">

    <xsl:output method="xml" indent="no"/>

    <xsl:template match="map">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE map PUBLIC "-//IFRS//DTD DITA Map//EN" "../../DocTypes/com.ifrs.doctype/dtd/ifrsMap.dtd"&gt;</xsl:text>
        <map>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </map>
    </xsl:template>

    <xsl:template match="bookmap">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE bookmap PUBLIC "-//IFRS//DTD DITA BookMap//EN" "../../DocTypes/com.ifrs.doctype/dtd/ifrsBookmap.dtd"&gt;</xsl:text>
        <bookmap>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </bookmap>
    </xsl:template>

    <xsl:template match="topic">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE topic PUBLIC "-//IFRS//DTD DITA Topic//EN" "../../../DocTypes/com.ifrs.doctype/dtd/ifrsTopic.dtd"&gt;</xsl:text>
        <topic>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </topic>
    </xsl:template>

    <xsl:template match="paragraph">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE paragraph PUBLIC "-//IFRS//DTD DITA Paragraph//EN" "../../../DocTypes/com.ifrs.doctype/dtd/paragraph.dtd"&gt;</xsl:text>
        <paragraph>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </paragraph>
    </xsl:template>

    <xsl:template match="glossentry">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE glossentry PUBLIC "-//IFRS//DTD DITA Glossary Entry//EN" "../../../DocTypes/com.ifrs.doctype/dtd/ifrsGlossentry.dtd"&gt;</xsl:text>
        <glossentry>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates/>
        </glossentry>
    </xsl:template>

    <xsl:template match="node() | @*">
        <xsl:copy>
            <xsl:apply-templates select="node() | @*"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="linebreak">
        <xsl:text> </xsl:text>
    </xsl:template>

    <xsl:template match="ol">
        <ol>
            <xsl:if test="li/li_value">
                <xsl:attribute name="outputclass">
                    <xsl:value-of select="'static'"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates select="@* | node()"/>
        </ol>
    </xsl:template>

    <xsl:template match="paranum">
        <paranum class="- topic/title paragraph/paranum "/>
        <titlealts>
            <navtitle>
                <xsl:apply-templates/>
            </navtitle>
        </titlealts>
    </xsl:template>

    <xsl:template match="entry_ref[ancestor::ol[@type = 'toc']]"/>


    <xsl:template match="chapter">
        <chapter>
            <xsl:copy-of select="@*"/>
            <xsl:if test="preceding-sibling::frontmatter/preface[contains(@href, '_rubric')]">
                <topicref>
                    <xsl:if test="preceding-sibling::frontmatter/preface/@href">
                        <xsl:attribute name="href">
                            <xsl:value-of select="preceding-sibling::frontmatter/preface/@href"/>
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:if test="preceding-sibling::frontmatter/preface/@class">
                        <xsl:attribute name="class">
                            <xsl:value-of select="'- map/topicref '"/>
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:attribute name="navtitle" select="'Rubric'"/>
                </topicref>
            </xsl:if>
            <xsl:apply-templates/>
        </chapter>
    </xsl:template>

    <xsl:template match="preface[contains(@href, '_rubric')]">
        <xsl:comment>&lt;preface href="<xsl:value-of select="@href"/>"&gt;<xsl:apply-templates/>&lt;/preface&gt;</xsl:comment>
        <!--<xsl:comment>
            <preface>
                <xsl:apply-templates select="@* | node()"/>
            </preface>
        </xsl:comment>-->
    </xsl:template>

    <xsl:template match="ph[@outputclass = 'def_xref' and xref[starts-with(@keyref, 'GLOSSARY_D')]]"/>

    <xsl:template
        match="xref[ph[@outputclass = 'def_xref']/xref[starts-with(@keyref, 'GLOSSARY_D')]]">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="body[ancestor::paragraph]">
        <body>
            <xsl:if test="ancestor::paragraph[@principles = 'yes']">
                <xsl:attribute name="outputclass">
                    <xsl:value-of select="'bold'"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </body>
    </xsl:template>

    <xsl:template match="frontmatter">
        <frontmatter>
            <xsl:attribute name="toc">
                <xsl:value-of select="'no'"/>
            </xsl:attribute>
            <xsl:copy-of select="@*"/>
            <xsl:apply-templates/>
        </frontmatter>
    </xsl:template>

    <xsl:template match="section[@outputclass = 'boardmembers']">
        <table outputclass="boardmembers">
            <title/>
            <tgroup cols="2">
                <colspec colname="col1" colwidth="50%"/>
                <colspec colname="col2" colwidth="50%"/>
                <tbody>
                    <xsl:apply-templates/>
                </tbody>
            </tgroup>
        </table>
    </xsl:template>

    <xsl:template match="data[@name = 'boardmember']">
        <row>
            <xsl:apply-templates/>
        </row>
    </xsl:template>

    <xsl:template match="data[@name = 'name']">
        <entry>
            <data name="name">
                <xsl:apply-templates/>
            </data>
        </entry>
        <xsl:choose>
            <xsl:when
                test="self::data[@name = 'name'][not(following-sibling::*[1][self::data[@name = 'role']])]">
                <entry/>
            </xsl:when>
            <xsl:otherwise/>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="data[@name = 'role']">
        <xsl:choose>
            <xsl:when
                test="self::data[@name = 'role'][not(preceding-sibling::*[1][self::data[@name = 'name']])]">
                <entry/>
            </xsl:when>
            <xsl:otherwise/>
        </xsl:choose>
        <entry>
            <data name="role">
                <xsl:apply-templates/>
            </data>
        </entry>
    </xsl:template>

    <xsl:template match="p[ancestor::thead]">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="image">
        <image>
            <xsl:if test="@href">
                <xsl:attribute name="href">
                    <xsl:value-of select="replace(@href, '.pdf', '.png')"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates select="@* except @href"/>
            <xsl:apply-templates/>
        </image>
    </xsl:template>

</xsl:stylesheet>
